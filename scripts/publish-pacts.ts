import pact from '@pact-foundation/pact-node'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { version } = JSON.parse(
  (await readFile(new URL('../lerna.json', import.meta.url))).toString()
) as { version: string }

const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  stdio: 'pipe',
})
const hash = String(result.stdout).trim()

const consumerVersion = `${version}-${hash}`

void pact
  .publishPacts({
    pactFilesOrDirs: [path.join(__dirname, '..', 'pacts')],
    pactBroker: 'https://pact.serlo.org/',
    pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
    consumerVersion,
  })
  .then(function () {
    // eslint-disable-next-line no-console
    console.log('success')
  })
