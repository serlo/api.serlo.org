// see https://github.com/remind101/jest-transform-graphql/issues/13#issuecomment-1367564978
// TODO: revert when https://github.com/remind101/jest-transform-graphql/pull/11 is published
const { process: upstreamProcess } = require('jest-transform-graphql')

const process = (...args) => {
  const code = upstreamProcess(...args)
  return { code }
}

module.exports = { process }
