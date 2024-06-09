import { spawnSync } from 'child_process'
import * as R from 'ramda'
import * as fs from 'fs'
import * as path from 'path'
import * as semver from 'semver'
import * as util from 'util'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const packageJsonPath = path.join(root, 'package.json')

const fsOptions: { encoding: BufferEncoding } = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

run()

async function run() {
  const { version } = await fetchPackageJSON()
  buildDockerImage({
    name: 'api-db-migration',
    version,
    Dockerfile: path.join(root, 'Dockerfile'),
    context: '.',
  })
}

function fetchPackageJSON(): Promise<{ version: string }> {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse)
}

export function buildDockerImage({
  name,
  version,
  Dockerfile,
  context,
}: {
  name: string
  version: string
  Dockerfile: string
  context: string
}) {
  const semanticVersion = semver.parse(version)

  if (!semanticVersion) {
    throw new Error(`illegal version number ${version}`)
  }

  const remoteName = `eu.gcr.io/serlo-shared/${name}`

  if (!shouldBuild()) {
    console.log(
      `Skipping deployment: ${remoteName}:${version} already in registry`,
    )
    return
  }

  const versions = getTargetVersions(semanticVersion).map((t) => t.toString())

  runBuild(versions)
  pushTags(versions)

  function shouldBuild() {
    const args = [
      'container',
      'images',
      'list-tags',
      remoteName,
      '--filter',
      `tags=${version}`,
      '--format',
      'json',
    ]

    const result = spawnSync('gcloud', args, { stdio: 'pipe' })
    const images = JSON.parse(String(result.stdout))

    return images.length === 0
  }

  function runBuild(versions: string[]) {
    const tags = [...toTags(name, versions), ...toTags(remoteName, versions)]
    const args = [
      'build',
      '-f',
      Dockerfile,
      ...tags.flatMap((tag) => ['-t', tag]),
      context,
    ]
    const result = spawnSync('docker', args, { stdio: 'inherit' })

    if (result.status !== 0) throw new Error(`Error while building ${name}`)
  }

  function pushTags(versions: string[]) {
    toTags(remoteName, versions).forEach((remoteTag) => {
      console.log('Pushing', remoteTag)
      const result = spawnSync('docker', ['push', remoteTag], {
        stdio: 'inherit',
      })
      if (result.status !== 0)
        throw new Error(`Error while pushing ${remoteTag}`)
    })
  }
}

function getTargetVersions(version: semver.SemVer) {
  const { major, minor, patch, prerelease } = version

  return prerelease.length > 0
    ? R.range(0, prerelease.length).map(
        (i) =>
          `${major}.${minor}.${patch}-${prerelease.slice(0, i + 1).join('.')}`,
      )
    : ['latest', `${major}`, `${major}.${minor}`, `${major}.${minor}.${patch}`]
}

function toTags(name: string, versions: string[]) {
  return versions.map((version) => `${name}:${version}`)
}
