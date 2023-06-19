declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const node: DocumentNode
  // eslint-disable-next-line import/no-default-export
  export default node
}
