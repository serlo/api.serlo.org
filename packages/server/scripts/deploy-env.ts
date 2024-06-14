import * as t from 'io-ts'
import { spawnSync } from 'node:child_process'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

void run()

function run() {
  const envName = process.argv[2]
  if (!envName) {
    throw new Error('You have to specify environment, staging or production')
  }
  if (!t.union([t.literal('staging'), t.literal('production')]).is(envName)) {
    throw new Error(
      'Invalid environment name, please use `staging` or `production`',
    )
  }
  buildDockerImage({
    name: 'api-server',
    context: '../..',
    envName,
  })
  buildDockerImage({
    name: 'api-swr-queue-worker',
    context: '../..',
    envName,
  })
}

function buildDockerImage({ name, context, envName }: DockerImageOptions) {
  const remoteName = `eu.gcr.io/serlo-shared/${name}`
  const date = new Date()
  const timestamp = `${date.toISOString().split('T')[0]}-${date.getTime()}`

  const { stdout: gitHashBuffer } = spawnSync('git', [
    'rev-parse',
    '--short',
    'HEAD',
  ])

  const remoteTags = toTags(remoteName, [
    envName,
    timestamp,
    gitHashBuffer.toString().split('\n')[0],
  ])
  const tags = [...remoteTags, ...toTags(name, [envName])]

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const root = path.join(__dirname, '..')
  const dockerfile = path.join(root, 'Dockerfile')

  const build = spawnSync(
    'docker',
    [
      'build',
      '-f',
      dockerfile,
      ...tags.flatMap((tag) => ['-t', tag]),
      context,
      '--build-arg',
      `image=${name.replace('api-', '')}`,
    ],
    { stdio: ['inherit', 'inherit', 'pipe'] },
  )

  if (build.stderr) {
    // eslint-disable-next-line no-console
    console.log(Error(build.stderr.toString()))
    process.exit(1)
  }

  remoteTags.forEach((remoteTag) => {
    // eslint-disable-next-line no-console
    console.log('Pushing', remoteTag)
    spawnSync('docker', ['push', remoteTag], { stdio: 'inherit' })
  })
}

function toTags(name: string, versions: string[]) {
  return versions.map((version) => `${name}:${version}`)
}

interface DockerImageOptions {
  name: string
  context: string
  envName: 'staging' | 'production'
}
