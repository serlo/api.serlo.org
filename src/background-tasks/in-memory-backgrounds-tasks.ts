import { BackgroundTasks } from '../graphql/environment'

export function createInMemoryBackgroundTasks(): BackgroundTasks {
  return {
    schedule(task) {
      void task.exec()
      return Promise.resolve()
    },
  }
}
