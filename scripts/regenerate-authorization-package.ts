/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { spawnSync } from 'child_process'
import fs from 'fs'
import { copy } from 'fs-extra'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function exec() {
  let i = 0
  while (i++ < 3) {
    try {
      await clean()
      await bundle()
      await generateEntry()
      return
    } catch (e) {
      console.log('Failed attempt', i, e)
    }
  }
  throw new Error('exec failed')

  async function clean() {
    const rm = util.promisify(rimraf)
    await rm('dist-authorization')
    const mkdir = util.promisify(fs.mkdir)
    await mkdir('dist-authorization')
    await rm(path.join('node_modules', '.cache'))
  }

  async function bundle() {
    const { status, error } = spawnSync('yarn', ['build:authorization'], {
      stdio: 'inherit',
    })
    if (status !== 0) {
      if (error) throw error
      throw new Error('build failed')
    }
    await copy(
      path.join(process.cwd(), 'dist'),
      path.join(process.cwd(), 'dist-authorization')
    )
  }

  async function generateEntry() {
    const readFile = util.promisify(fs.readFile)
    const writeFile = util.promisify(fs.writeFile)
    const fsOptions = { encoding: 'utf-8' as BufferEncoding }

    const packageJson = await readFile(
      path.join(process.cwd(), 'package.json'),
      { encoding: 'utf-8' }
    )
    const metadata = JSON.parse(packageJson) as {
      version: string
      bugs: {
        url: string
      }
      repository: string
      license: string
      author: string
    }
    const dir = path.join(process.cwd(), 'dist-authorization')
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify(
        {
          name: '@serlo/authorization',
          version: metadata.version,
          bugs: metadata.bugs,
          repository: metadata.repository,
          license: metadata.license,
          author: metadata.author,
          module: 'api.serlo.org.esm.js',
          main: 'index.js',
          typings: 'authorization.d.ts',
          publishConfig: {
            access: 'public',
          },
        },
        null,
        2
      ),
      fsOptions
    )
  }
}
