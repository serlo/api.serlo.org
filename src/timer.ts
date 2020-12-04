export interface Timer {
  now: typeof Date.now
}

export function createTimer(): Timer {
  return {
    now() {
      return Date.now()
    },
  }
}
