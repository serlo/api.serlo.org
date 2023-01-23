/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as util from 'node:util'
import * as R from 'ramda'
import semver from 'semver'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const root = path.join(__dirname, '..')
const packageJsonPath = path.join(root, 'package.json')

const fsOptions: { encoding: BufferEncoding } = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

void run().then(() => {})

async function run() {
  const { version } = await fetchPackageJSON()
  buildDockerImage({
    name: 'api-server',
    version,
    Dockerfile: path.join(root, 'docker', 'server', 'Dockerfile'),
    context: '../..',
  })
  buildDockerImage({
    name: 'api-swr-queue-worker',
    version,
    Dockerfile: path.join(root, 'docker', 'swr-queue-worker', 'Dockerfile'),
    context: '../..',
  })
}

function fetchPackageJSON() {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse) as Promise<{
    version: string
  }>
}

function buildDockerImage({
  name,
  version,
  Dockerfile,
  context,
}: DockerImageOptions) {
  const semanticVersion = semver.parse(version)

  if (semanticVersion === null) throw new Error(`illegal version ${version}`)

  const remoteName = `eu.gcr.io/serlo-shared/${name}`
  const result = spawnSync(
    'gcloud',
    [
      'container',
      'images',
      'list-tags',
      remoteName,
      '--filter',
      `tags=${version}`,
      '--format',
      'json',
    ],
    { stdio: 'pipe' }
  )
  const images = JSON.parse(String(result.stdout)) as unknown[]

  if (images.length > 0) {
    console.log(
      `Skipping deployment: ${remoteName}:${version} already present in registry`
    )
    return
  }

  const targetVersions = getTargetVersions(semanticVersion)
  const remoteTags = toTags(remoteName, targetVersions)
  const tags = [...remoteTags, ...toTags(name, targetVersions)]

  spawnSync(
    'docker',
    ['build', '-f', Dockerfile, ...tags.flatMap((tag) => ['-t', tag]), context],
    { stdio: 'inherit' }
  )

  remoteTags.forEach((remoteTag) => {
    console.log('Pushing', remoteTag)
    spawnSync('docker', ['push', remoteTag], { stdio: 'inherit' })
  })
}

function getTargetVersions(version: semver.SemVer) {
  const { major, minor, patch, prerelease } = version

  return prerelease.length > 0
    ? [
        'next',
        ...R.range(0, prerelease.length).map(
          (i) =>
            `${major}.${minor}.${patch}-${prerelease.slice(0, i + 1).join('.')}`
        ),
      ]
    : ['latest', `${major}`, `${major}.${minor}`, `${major}.${minor}.${patch}`]
}

function toTags(name: string, versions: string[]) {
  return versions.map((version) => `${name}:${version}`)
}

interface DockerImageOptions {
  name: string
  version: string
  Dockerfile: string
  context: string
}
