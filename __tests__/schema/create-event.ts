/**
 * Since createEvent has a quite complex logic, I've added this test file,
 * which makes sure this helper function does what it is supposed to.
 * But it tests the internals and not the behavior.
 * It will be better to use the createEvent function in a real
 * world test case, and then remove this file.
 */
import { article, user } from '../../__fixtures__'
import { EventType, createEvent } from '~/schema/notification/event'
import { Instance } from '~/types'

describe('createEvent', () => {
  const basePayload = {
    type: EventType.CheckoutRevision,
    actorId: user.id,
    instance: Instance.De,
    objectId: article.id,
    parameters: {},
  }

  test('fails if actor does not exist', async () => {
    await expect(
      createEvent({ ...basePayload, actorId: 5 }, getContext()),
    ).rejects.toThrow()
  })

  test('fails if object does not exist', async () => {
    await expect(
      createEvent({ ...basePayload, objectId: 0 }, getContext()),
    ).rejects.toThrow()
  })

  test('fails if name from parameters is invalid', async () => {
    const initialEventsNumber = await getEventsNumber()

    await global.database.mutate(
      'delete from event_parameter_name where name = "to"',
    )

    await expect(
      createEvent(
        { ...basePayload, parameters: { to: 'approved' } },
        getContext(),
      ),
    ).rejects.toThrow()

    const finalEventsNumber = await getEventsNumber()
    expect(finalEventsNumber).toEqual(initialEventsNumber)
  })

  test('fails if uuid number in parameters does not exist', async () => {
    await expect(
      createEvent(
        { ...basePayload, parameters: { object: 40000 } },
        getContext(),
      ),
    ).rejects.toThrow()
  })

  test('creates event successfully with right payload', async () => {
    // TODO: After removing getEvent() this needs to be rewritten

    const initialEventsNumber = await getEventsNumber()

    const event = await createEvent(basePayload, getContext())
    expect(event.type).toBe(basePayload.type)
    expect(event.actorId).toBe(basePayload.actorId)
    expect(event.objectId).toBe(basePayload.objectId)
    expect(event.instance).toBe(Instance.De)

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
