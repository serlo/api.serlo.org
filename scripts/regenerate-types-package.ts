import { spawnSync } from 'child_process'
import fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { invoke } from './api-extractor'

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
      bundle()
      invokeApiExtractor()
      await generateEntry()
      return
    } catch (e) {
      console.log('Failed attempt', i, e)
    }
  }
  throw new Error('exec failed')

  async function clean() {
    const rm = util.promisify(rimraf)
    await rm('dist-types')
    await rm(path.join('node_modules', '.cache'))
  }

  function bundle() {
    const { status, error } = spawnSync(
      'yarn',
      ['build', '--entry', 'src/types.ts'],
      {
        stdio: 'inherit',
      }
    )
    if (status !== 0) {
      if (error) throw error
      throw new Error('build failed')
    }
  }

  function invokeApiExtractor() {
    invoke({
      localBuild: true,
      showVerboseMessages: true,
    })
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
    const dir = path.join(process.cwd(), 'dist-types')
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify(
        {
          name: '@serlo/api',
          version: metadata.version,
          bugs: metadata.bugs,
          repository: metadata.repository,
          license: metadata.license,
          author: metadata.author,
          typings: `index.d.ts`,
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
