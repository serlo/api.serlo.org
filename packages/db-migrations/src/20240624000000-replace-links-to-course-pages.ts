import * as t from 'io-ts'
import * as R from 'ramda'

import {
  ApiCache,
  Database,
  migrateSerloEditorContent,
  transformPlugins,
} from './utils'

const TextPlugin = t.type({
  plugin: t.literal('text'),
  state: t.array(t.unknown),
})

interface CoursePage {
  coursePageId: number
  courseId: number
}

const Link = t.type({
  type: t.literal('a'),
  href: t.string,
  children: t.array(t.unknown),
})

export async function up(db: Database) {
  const apiCache = new ApiCache()

  const coursePages = await db.runSql<CoursePage[]>(`
    WITH RankedPages AS (
      SELECT
        entity.id AS coursePageId,
        ent2.id AS courseId,
        ROW_NUMBER() OVER (PARTITION BY ent2.id ORDER BY entity.date) AS page_rank
      FROM entity
      JOIN entity_link ON entity.id = entity_link.child_id
      JOIN entity ent2 ON entity_link.parent_id = ent2.id
      WHERE entity.type_id = 8
    )
    SELECT coursePageId, courseId
    FROM RankedPages
    WHERE page_rank > 1
  `)

  await migrateSerloEditorContent({
    apiCache,
    db,
    migrationName: 'replace-links-to-course-pages',
    migrateState: transformPlugins({
      text: (plugin) => {
        if (!TextPlugin.is(plugin)) return undefined

        const pluginState = plugin.state
        if (!pluginState || !pluginState.length) return undefined

        const clonedState = structuredClone(pluginState)

        replaceLinks(clonedState, coursePages)

        if (!R.equals(clonedState, pluginState)) {
          return [{ ...plugin, state: clonedState }]
        }

        return [plugin]
      },
    }),
  })

  await apiCache.deleteKeysAndQuit()
}

function replaceLinks(object: object, coursePages: CoursePage[]) {
  if (Link.is(object)) {
    const startsWithSlash = object.href.at(0) === '/'
    const containsSerlo = object.href.includes('serlo')
    const isAnAttachment = object.href.startsWith('/attachment/')

    if ((startsWithSlash || containsSerlo) && !isAnAttachment) {
      coursePages.forEach((coursePage) => {
        const { courseId, coursePageId } = coursePage

        /*console.log('link to course page replaced with new format: ', {
          initialHrefValue: object.href,
          ...coursePage,
        })*/
        object.href = object.href.replace(
          coursePageId.toString(),
          `${courseId}/${coursePageId}`,
        )
      })
    }
  }

  Object.values(object).forEach((value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      replaceLinks(value, coursePages)
    }
  })
}
