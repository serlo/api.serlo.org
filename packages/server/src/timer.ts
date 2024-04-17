export interface Timer {
  now: typeof Date.now
}

export function createTimer(): Timer {
  return {
    now() {
      return Date.now()
    },
  }
}export interface Time {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
}
export function timeToSeconds({
  days = 0, hours = 0, minutes = 0, seconds = 0,
}: Time) {
  return ((days * 24 + hours) * 60 + minutes) * 60 + seconds
}
export function timeToMilliseconds(time: Time) {
  return timeToSeconds(time) * 1000
}

