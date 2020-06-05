/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as R from 'ramda'
import * as semver from 'semver'
import * as util from 'util'

const root = path.join(__dirname, '..')
const packageJsonPath = path.join(root, 'package.json')

const fsOptions = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

void run().then(() => {})

async function run() {
  const { version } = await fetchPackageJSON()
  buildDockerImage({
    name: 'api',
    version,
    Dockerfile: path.join(root, 'Dockerfile'),
    context: '.',
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
  if (!semver.valid(version)) {
    return
  }

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

  spawnSync(
    'docker',
    [
      'build',
      '-f',
      Dockerfile,
      ...R.flatten(getTags(version).map((tag) => ['-t', `${name}:${tag}`])),
      context,
    ],
    {
      stdio: 'inherit',
    }
  )

  const remoteTags = R.map((tag) => `${remoteName}:${tag}`, getTags(version))
  remoteTags.forEach((remoteTag) => {
    console.log('Pushing', remoteTag)
    spawnSync('docker', ['tag', `${name}:latest`, remoteTag], {
      stdio: 'inherit',
    })
    spawnSync('docker', ['push', remoteTag], { stdio: 'inherit' })
  })
}

function getTags(version: string) {
  return [
    'latest',
    semver.major(version),
    `${semver.major(version)}.${semver.minor(version)}`,
    `${semver.major(version)}.${semver.minor(version)}.${semver.patch(
      version
    )}`,
  ]
}

interface DockerImageOptions {
  name: string
  version: string
  Dockerfile: string
  context: string
}
