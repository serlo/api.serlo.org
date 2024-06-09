import assert from 'assert'
import { v4 as uuidv4 } from 'uuid'
import { zip } from 'fp-ts/Array'
import * as t from 'io-ts'

import { ApiCache, Database, SlackLogger } from './utils'

export async function up(db: Database) {
  const apiCache = new ApiCache()
  const logger = new SlackLogger(
    '20240506145600-merge-course-pages-into-courses',
  )

  const batchSize = 5000
  let entities: Row[] = []

  do {
    const lastUpdatedEntityId = entities.at(-1)?.entityId ?? 0

    entities = await db.runSql<Row[]>(
      `select
           entity.id as entityId
         from entity
         join type on entity.type_id = type.id
         where type.name in ("course")
         and entity.id > ?
         order by entity.id limit ?`,
      lastUpdatedEntityId,
      batchSize,
    )

    for (const entity of entities) {
      await updateExerciseGroup(db, apiCache, entity.entityId, logger)
    }
  } while (entities.length > 0)

  apiCache.deleteUnrevisedRevisions()
  await logger.closeAndSend()
  // To reduce the time between deleting the keys and finishing the DB
  // transaction, this should be the last command
  await apiCache.deleteKeysAndQuit()

  interface Row {
    entityId: number
  }
}

const ChildContentDecoder = t.intersection([
  t.type({
    content: t.type({
      plugin: t.literal('rows'),
    }),
  }),
  t.partial({
    title: t.string,
    id: t.string,
  }),
])
const ParentContentDecoder = t.type({
  plugin: t.literal('course'),
  state: t.record(t.string, t.unknown),
})
const RowPluginDecoder = t.type({ plugin: t.literal('rows') })
const TextPluginDecoder = t.type({ plugin: t.literal('text') })

async function updateExerciseGroup(
  db: Database,
  apiCache: ApiCache,
  parentId: number,
  logger: SlackLogger,
) {
  // Load the tree of the parent entity. It is either only the parent (without the
  // solution / without any children):
  //
  //    [ parent ]
  //
  // or it is a parent with children:
  //
  //    [ parent ]
  //      └ [ child1 ]
  //      └ [ child2 ]
  //
  // The list of revisions are stored next to the entity in the node:
  //
  //    [ parent ]:      [ e1, e2, e3, ...]
  //      └ [ child1 ]   [ s1, s2, s3, ...]
  const parentNode = await loadEntityNode(db, parentId)

  for (const child of parentNode.children) {
    assert(child.children.length === 0, 'child must not have children')
  }

  // If a parent does not have any revision, there is no transformation possible.
  // Even if the child(solution / exercise / course-page) has revisions.
  if (parentNode.value.revisions.length === 0) {
    console.log(`Warning: Parent (${parentId}) has no revision`)
    return
  }

  // From the tree of revisions we calculate the list of overall edits. We
  // represent an edit as a tree with the
  // same structure as the parent. The value for parent / child is
  // a revision (type `EntityWithRevision`) if the parent / child was
  // edited or `null` when it was not edited. So let's assume the entity
  // tree with the revisions has the structure
  //
  //    [ parent ]       [ edit_on_date1 | edit_on_date2 ]
  //      └ [ child1 ]   [ edit_on_date1 | edit_on_date3 ]
  //
  // Then the list of edits is
  //
  // [ edit_on_date1 ]     | [ edit_on_date2 ] | [ null ]
  //   └ [ edit_on_date2 ] |   └ [ null ]      |   └ [ edit_on_date3 ]
  const edits = getEdits(parentNode)

  if (edits.length > 0 && edits[0].value == null) {
    console.log(
      `Warning: Parent entity ${parentId} has a revision for a child before its first revision`,
    )
  }

  // When one child has a revision before the parent we use the first
  // revision of the parent as the fallback content
  const fallbackParent = edits.filter((r) => r.value != null).at(0)

  assert(
    fallbackParent?.value != null,
    `Illegal state: Parent entity ${parentId} has no content`,
  )

  // Here we store the current version of the parent after each edit. We
  // start with everything is null.
  let currentVersion: TreeNode<EntityWithRevision | null> = mapTree(
    () => null,
    parentNode,
  )

  for (const edit of edits) {
    // Add the edit to the current version
    currentVersion = concatTree(
      (a, b) => (b == null ? a : b),
      currentVersion,
      edit,
    )

    const currentParent = currentVersion.value ?? fallbackParent.value
    // Current children of this edit while we only take those
    // children which have at least one revision
    const currentChildren = currentVersion.children.filter(hasNonEmptyRevision)

    let parentContent = JSON.parse(
      currentParent?.revision?.content ??
        JSON.stringify({ plugin: 'rows', state: [] }),
    ) as unknown

    // Should not happen with our fallback...
    assert(parentContent != null, 'Illegal state: Parent is null')

    if (TextPluginDecoder.is(parentContent)) {
      parentContent = { plugin: 'rows', state: [parentContent], id: uuidv4() }
    }

    if (RowPluginDecoder.is(parentContent)) {
      parentContent = {
        plugin: 'course',
        state: { content: parentContent },
        id: uuidv4(),
      }
    }

    if (!ParentContentDecoder.is(parentContent)) {
      console.log({ parentContent })

      throw new Error(
        `Illegal content for parent entity ${parentId} with current revision ${currentParent.revision.id}`,
      )
    }

    // Do not update a migrated parent again
    if (parentContent.state.pages != null) continue

    const childrenContent = currentChildren.map((node) => {
      const value = node.value
      let content = JSON.parse(value.revision.content)
      const id = `${value.id}-course-page`

      if ('cells' in content) {
        console.warn(
          `Splish content found for child ${value.id} with current revision ${value.revision.id}`,
        )

        content = {
          plugin: 'rows',
          state: [
            {
              plugin: 'unsupported',
              state: {
                plugin: 'splishContent',
                state: content,
              },
              id: uuidv4(),
            },
          ],
          id: uuidv4(),
        }
      }

      if (RowPluginDecoder.is(content)) {
        content = { content }
      }

      content.id = id

      if (!ChildContentDecoder.is(content)) {
        console.log({ content: JSON.stringify(content, undefined, 2) })
        throw new Error(
          `Illegal content for child ${value.id} with current revision ${value.revision.id}`,
        )
      }

      content.title = value.revision.title ?? `Course page ${value.id}`
      // Uncomment when license need to be updated as well
      /*
      if (currentParent.licenseId !== value.licenseId) {
        content.state['licenseId'] = value.licenseId
      }
      */

      return content
    })

    parentContent.state['pages'] = childrenContent

    const newContent = JSON.stringify(parentContent)

    if (edit.value != null) {
      // In this edit a parent revision was added -> We can change the
      // content of it

      await updateEntityRevisionField({
        db,
        revisionId: edit.value.revision.id,
        field: 'content',
        value: newContent,
      })

      logger.logEvent('changeParentContent', {
        entityId: edit.value.id,
        revisionId: edit.value.revision.id,
        oldContent: edit.value.revision.content,
        newContent,
      })

      apiCache.markUuid(edit.value.revision.id)
    } else {
      // In this edit the parent was not changed -> Let's use the revision
      // of one changed child and change it to a revision of the parent
      const revisionToOvertake = getValues(edit).filter(isNotNull).at(0)

      // This should not happen
      assert(revisionToOvertake !== undefined)

      await migrate(
        db,
        ` update entity_revision set repository_id = ?
          where id = ?`,
        parentId,
        revisionToOvertake.revision.id,
      )

      if (currentParent.revision.title != null) {
        await updateEntityRevisionField({
          db,
          revisionId: revisionToOvertake.revision.id,
          field: 'title',
          value: currentParent.revision.title,
        })
      }

      if (currentParent.revision.description != null) {
        await updateEntityRevisionField({
          db,
          revisionId: revisionToOvertake.revision.id,
          field: 'meta_description',
          value: currentParent.revision.description,
        })
      }

      for (const child of parentNode.children) {
        // We need to update the current revision of the child -> Otherwise
        // staging would try to load the revision which results in an error
        if (child.value.currentRevisionId === revisionToOvertake.revision.id) {
          await migrate(
            db,
            ` update entity set current_revision_id = NULL
            where id = ?`,
            child.value.id,
          )

          logger.logEvent('currentRevisionSetToNull', {
            entityId: child.value.id,
          })

          // Update the current revision of the parent since we know that
          // we have added a new revision to the child which was already
          // reviewed
          await updateCurrentRevisionOfEntity({
            db,
            apiCache,
            parent: parentNode.value,
            child: child.value,
            logger,
          })

          apiCache.markUuid(child.value.id)
        }
      }

      await updateEntityRevisionField({
        db,
        revisionId: revisionToOvertake.revision.id,
        field: 'content',
        value: newContent,
      })

      logger.logEvent('overtakeChildContent', {
        revisionToOvertake,
        newContent,
      })

      apiCache.markUuid(revisionToOvertake.revision.id)
    }
  }

  apiCache.markUuid(parentNode.value.id)

  for (const child of parentNode.children) {
    await moveCommentsFromChildToParent({
      db,
      apiCache,
      parent: parentNode.value,
      child: child.value,
    })

    apiCache.markUuid(child.value.id)
  }
}

async function updateEntityRevisionField({
  db,
  revisionId,
  field,
  value,
}: {
  db: Database
  revisionId: number
  field: string
  value: string
}) {
  const { affectedRows } = await db.runSql<{ affectedRows: number }>(
    ` update entity_revision set ${field} = ?
          where id = ?`,
    value,
    revisionId,
  )

  if (affectedRows === 0) {
    await db.runSql(
      `insert into entity_revision
          (entity_revision_id, ?)
          values (?, ?)`,
      field,
      revisionId,
      value,
    )
  }
}

async function updateCurrentRevisionOfEntity({
  db,
  apiCache,
  parent,
  child,
  logger,
}: {
  db: Database
  apiCache: ApiCache
  parent: EntityBase
  child: EntityBase
  logger: SlackLogger
}) {
  if (
    child.currentRevisionId != null &&
    child.currentRevisionId > (parent.currentRevisionId ?? 0)
  ) {
    await db.runSql(
      `update entity set current_revision_id = ? where id = ?`,
      child.currentRevisionId,
      parent.id,
    )

    logger.logEvent('currentRevisionChanged', {
      entityId: parent.id,
      currentRevision: {
        old: parent.currentRevisionId,
        new: child.currentRevisionId,
      },
    })

    apiCache.markUuid(parent.id)
  }
}

async function moveCommentsFromChildToParent({
  db,
  apiCache,
  parent,
  child,
}: {
  db: Database
  apiCache: ApiCache
  parent: EntityBase
  child: EntityBase
}) {
  const commentsOfSolution = await db.runSql<{ id: number }[]>(
    `select id from comment where uuid_id = ?`,
    child.id,
  )

  await db.runSql(
    `update comment set uuid_id = ? where uuid_id = ?`,
    parent.id,
    child.id,
  )

  for (const comment of commentsOfSolution) {
    apiCache.markUuid(comment.id)
  }

  apiCache.deleteThreadIds(parent.id)
  apiCache.deleteThreadIds(child.id)
}

/**
 * Returns list of all edits by the following algorithm:
 *
 *    while (there are still revisions in the parent its children) {
 *      // 1. Take the min date of all revisions
 *
 *      // 2. For parent and children split the first revision from it's
 *      //    list of revisions if it's date is less than minDate + 10 seconds
 *    }
 */
function getEdits(
  entity: TreeNode<EntityWithRevisions>,
): TreeNode<EntityWithRevision | null>[] {
  let remainingRevisions = entity
  let edits: TreeNode<EntityWithRevision | null>[] = []

  while (
    getValues(remainingRevisions).some((entity) => entity.revisions.length > 0)
  ) {
    const firstDates = getValues(remainingRevisions)
      .map((entity) => entity.revisions.at(0)?.date ?? null)
      .filter(isNotNull)
    const minDate = firstDates.reduce((a, b) => (a <= b ? a : b))

    const nextEdit = splitNextEdit(remainingRevisions, minDate)

    edits.push(nextEdit.nextEdit)

    remainingRevisions = nextEdit.remainingRevisions
  }

  return edits
}

function splitNextEdit(
  node: TreeNode<EntityWithRevisions>,
  date: Date,
): {
  nextEdit: TreeNode<EntityWithRevision | null>
  remainingRevisions: TreeNode<EntityWithRevisions>
} {
  let nextEditRevision: EntityWithRevision | null
  let remainingRevisions: EntityWithRevisions

  if (
    node.value.revisions.length > 0 &&
    node.value.revisions[0].date.getTime() < date.getTime() + 10 * 1000
  ) {
    const base = {
      id: node.value.id,
      licenseId: node.value.licenseId,
      typeName: node.value.typeName,
      currentRevisionId: node.value.currentRevisionId,
    }
    nextEditRevision = { ...base, revision: node.value.revisions[0] }
    remainingRevisions = { ...base, revisions: node.value.revisions.slice(1) }
  } else {
    nextEditRevision = null
    remainingRevisions = node.value
  }

  const children = node.children.map((child) => splitNextEdit(child, date))
  const nextEditChildren = children.map((x) => x.nextEdit)
  const remainingRevisionsChildren = children.map((x) => x.remainingRevisions)

  return {
    nextEdit: { value: nextEditRevision, children: nextEditChildren },
    remainingRevisions: {
      value: remainingRevisions,
      children: remainingRevisionsChildren,
    },
  }
}

async function loadEntityNode(
  db: Database,
  entityId: number,
): Promise<TreeNode<EntityWithRevisions>> {
  const entity = await loadEntity(db, entityId)
  let childIds: number[] = []

  if (entity.typeName === TypeName.Course) {
    childIds = await loadEntityChildrenIds({
      db,
      entityId: entityId,
      childType: TypeName.CoursePage,
    })
  }

  const children = await Promise.all(
    childIds.map((childId) => loadEntityNode(db, childId)),
  )

  return { value: entity, children }
}

async function loadEntityChildrenIds({
  db,
  entityId,
  childType,
  limit,
}: {
  db: Database
  entityId: number
  childType: TypeName
  limit?: number
}): Promise<number[]> {
  let sqlCommand = `
      select entity_link.child_id as childId
      from entity_link
      join entity child on child.id = entity_link.child_id
      join type child_type on child_type.id = child.type_id
      join uuid child_uuid on child_uuid.id = child.id
      where
        entity_link.parent_id = ? and child_type.name = ?
        and child_uuid.trashed = 0
      order by entity_link.order ASC`

  if (limit != null) {
    sqlCommand += ` limit ${limit}`
  }

  const result = await db.runSql<{ childId: number }[]>(
    sqlCommand,
    entityId,
    childType,
  )

  return result.map((row) => row.childId)
}

async function loadEntity(
  db: Database,
  entityId: number,
): Promise<EntityWithRevisions> {
  const entityBaseResult = await db.runSql<EntityBase[]>(
    ` select
        entity.id as id,
        entity.license_id as licenseId,
        entity.current_revision_id as currentRevisionId,
        type.name as typeName
      from entity
      join type on entity.type_id = type.id
      where entity.id = ?`,
    entityId,
  )
  const entityBase = pickSingleton(entityBaseResult)

  assert(
    isTypeName(entityBase.typeName),
    `Entity ${entityId} has unsupported type name`,
  )

  const revisions = await loadRevisions(db, entityId)

  return { ...entityBase, revisions }
}

async function loadRevisions(
  db: Database,
  entityId: number,
): Promise<Revision[]> {
  return await db.runSql<Revision[]>(
    ` select
          entity_revision.id,
          entity_revision.date,
          content,
          title,
          meta_description as description
      from entity_revision
      where entity_revision.repository_id = ?
      order by entity_revision.date`,
    entityId,
  )
}

function hasNonEmptyRevision(
  node: TreeNode<EntityWithRevision | null>,
): node is TreeNode<EntityWithRevision> {
  if (node.value == null) return false

  const content = node.value.revision.content

  return content != null && content !== ''
}

/**
 * Lifts a function from the value of the tree to the tree itself. Similar to
 * how `map` is defined for lists.
 */
function mapTree<A, B>(mapper: (x: A) => B, node: TreeNode<A>): TreeNode<B> {
  return {
    value: mapper(node.value),
    children: node.children.map((child) => mapTree(mapper, child)),
  }
}

/**
 * Lifts an operation on the value of a tree to the tree itself. When `concat`
 * for example is an operation on a type `A`, then `concatTree` can be used
 * to get an operation on `TreeNode<A>` by applying `concat` to all values.
 * Thereby we check that both trees have the same structure.
 */
function concatTree<A>(
  concat: (x: A, y: A) => A,
  x: TreeNode<A>,
  y: TreeNode<A>,
): TreeNode<A> {
  // In our case the structure of both trees should always be the same.
  assert(
    x.children.length === y.children.length,
    'Illegal state: Both nodes should have the same number of children.',
  )

  return {
    value: concat(x.value, y.value),
    children: zip(x.children, y.children).map(([x, y]) =>
      concatTree(concat, x, y),
    ),
  }
}

function getValues<V>(node: TreeNode<V>): V[] {
  return [node.value, ...node.children.flatMap(getValues)]
}

function pickSingleton<A>(elements: A[]): A {
  assert(elements.length === 1, 'List has more than one element')

  return elements[0]
}

interface TreeNode<ValueType> {
  value: ValueType
  children: TreeNode<ValueType>[]
}

interface EntityWithRevisions extends EntityBase {
  revisions: Revision[]
}

interface EntityWithRevision extends EntityBase {
  revision: Revision
}

interface Revision {
  id: number
  date: Date
  content: string
  title: string | null
  description: string | null
}

interface EntityBase {
  id: number
  licenseId: number
  currentRevisionId: number | null
  typeName: TypeName
}

enum TypeName {
  Course = 'course',
  CoursePage = 'course-page',
}

function isTypeName(values: string): values is TypeName {
  return Object.values<string>(TypeName).includes(values)
}

function isNotNull<A>(value: A | null): value is A {
  return value != null
}

// I added this function so that I can easily outcomment all mutations in order
// to avoid a rollback of the DB. -- Kulla
async function migrate(db: Database, sql: string, ...args: unknown[]) {
  await db.runSql(sql, ...args)
}
