import { Request, Response } from 'node-fetch'
import { extendExpect } from './__tests__/_extend-jest'

extendExpect()

/*
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      Response: typeof Response
      Request: typeof Request
    }
  }
}*/
