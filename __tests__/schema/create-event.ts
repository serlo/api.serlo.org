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
    actorId: user.id,
    eventType: EventType.CheckoutRevision,
    instance_id: 1,
    objectId: article.id,
    stringParameters: {},
    uuidParameters: {},
  }

  test('fails if actor does not exist', async () => {
    await expect(
      createEvent({ ...basePayload, actorId: 5 }, global.database),
    ).rejects.toThrow()
  })

  test('fails if object does not exist', async () => {
    await expect(
      createEvent({ ...basePayload, objectId: 0 }, global.database),
    ).rejects.toThrow()
  })

  test('fails if name from stringParameters is invalid', async () => {
    await expect(
      createEvent(
        { ...basePayload, stringParameters: { bla: 'approved' } },
        global.database,
      ),
    ).rejects.toThrow()
  })

  test('fails if name from uuidParameters is invalid', async () => {
    await expect(
      createEvent(
        { ...basePayload, uuidParameters: { bla: article.id } },
        global.database,
      ),
    ).rejects.toThrow()
  })

  test('fails if uuid from uuidParameter does not exist', async () => {
    await expect(
      createEvent(
        { ...basePayload, uuidParameters: { object: 40000 } },
        global.database,
      ),
    ).rejects.toThrow()
  })

  test('creates event successfully with right payload', async () => {
    const event = await createEvent(basePayload, global.database)
    expect(event.__typename).toBe(basePayload.eventType)
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
  })
})
