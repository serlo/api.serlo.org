// We make this synchronous function asynchronous just to make clear that this would be asynchronous in production.
// eslint-disable-next-line @typescript-eslint/require-await
export async function waitFor(seconds: number) {
  global.timer.now.mockReturnValue(global.timer.now() + seconds * 1000)
}
