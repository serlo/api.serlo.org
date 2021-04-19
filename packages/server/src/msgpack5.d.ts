declare module 'msgpack5' {
  // eslint-disable-next-line import/no-default-export
  export default function createMsgpack(): {
    encode(decoded: unknown): Buffer
    decode<T>(encoded: Buffer): T
  }
}
