/**
 * Since createEvent has a quite complex logic, I've added this test file,
 * which makes sure this helper function does what it is supposed to.
 * But it tests the internals and not the behavior.
 * It will be better to use the createEvent function in a real
 * world test case, and then remove this file.
 */
import { article, comment, user } from '../../__fixtures__'
import { NotificationEventType } from '~/model/decoder'
import {
  createEvent,
  toConcreteEvent,
  AbstractEvent,
} from '~/schema/notification/event'
import { Instance } from '~/types'

const basePayload = {
  __typename: NotificationEventType.CreateComment,
  actorId: user.id,
  instance: Instance.De,
  threadId: article.id,
  commentId: comment.id,
} as const

test('fails if actor does not exist', async () => {
  await expect(
    createEvent({ ...basePayload, actorId: 5 }, getContext()),
  ).rejects.toThrow()
})

test('fails if object does not exist', async () => {
  await expect(
    createEvent({ ...basePayload, threadId: 0 }, getContext()),
  ).rejects.toThrow()
})

test('fails if name from parameters is invalid', async () => {
  const initialEventsNumber = await getEventsNumber()

  await global.database.mutate(
    'delete from event_parameter_name where name = "discussion"',
  )

  await expect(createEvent(basePayload, getContext())).rejects.toThrow()

  const finalEventsNumber = await getEventsNumber()
  expect(finalEventsNumber).toEqual(initialEventsNumber)
})

test('fails if uuid number in parameters does not exist', async () => {
  await expect(
    createEvent({ ...basePayload, threadId: 40000 }, getContext()),
  ).rejects.toThrow()
})

test('creates event successfully with right payload', async () => {
  const initialEventsNumber = await getEventsNumber()

  await createEvent(basePayload, getContext())

  const lastAbstractEvent = await database.fetchOne<AbstractEvent>(`
      select
        event_log.id as id,
        event.name as type,
        event_log.actor_id as actorId,
        instance.subdomain as instance,
        event_log.date as date,
        event_log.uuid_id as objectId,
        JSON_OBJECTAGG(event_parameter_name.name, event_parameter_uuid.uuid_id) as uuidParameters,
        JSON_OBJECTAGG(event_parameter_name.name, event_parameter_string.value) as stringParameters
      from event_log
      join event on event.id = event_log.event_id
      join instance on event_log.instance_id = instance.id
      join event_parameter on event_parameter.log_id = event_log.id
      join event_parameter_name on event_parameter.name_id = event_parameter_name.id
      left join event_parameter_string on event_parameter_string.event_parameter_id = event_parameter.id
      left join event_parameter_uuid on event_parameter_uuid.event_parameter_id = event_parameter.id
      group by event_log.id
      order by id desc
      limit 1
    `)

  const event = toConcreteEvent(lastAbstractEvent)

  expect(event).toEqual({
    id: expect.any(Number) as number,
    date: expect.any(String) as string,
    actorId: basePayload.actorId,
    instance: basePayload.instance,
    objectId: basePayload.commentId,
    __typename: basePayload.__typename,
    threadId: basePayload.threadId,
    commentId: basePayload.commentId,
  })

  expect(
    await database.fetchAll(
      'select * from notification_event where event_log_id = ?',
      [event.id],
    ),
  ).not.toHaveLength(0)
  // TODO: be sure the notifications are set to right users and objects

  const finalEventsNumber = await getEventsNumber()
  expect(finalEventsNumber).not.toEqual(initialEventsNumber)
})

async function getEventsNumber() {
  return (
    await global.database.fetchOne<{ n: number }>(
      'SELECT count(*) AS n FROM event_log',
    )
  ).n
}

function getContext() {
  return { database: global.database }
}
