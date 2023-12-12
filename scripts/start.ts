import graphqlLoaderPlugin_ from '@luckycatfactory/esbuild-graphql-loader'
import { spawn, ChildProcess } from 'child_process'
import { defaultImport } from 'default-import'
import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const graphqlLoaderPlugin = defaultImport(graphqlLoaderPlugin_)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const root = path.join(__dirname, '..')
const dist = path.join(root, 'dist')

await main()

async function main() {
  const [sourceArg, targetArg] = process.argv.slice(2)

  const source = path.resolve(sourceArg)

  if (!fs.statSync(source).isFile()) {
    throw new Error(`File ${source} does not exist`)
  }

  const outfile = path.join(dist, targetArg)

  let serverProcess: ChildProcess | null = null

  const startServerPlugin: esbuild.Plugin = {
    name: 'startServer',
    setup(build) {
      build.onStart(() => {
        // eslint-disable-next-line no-console
        console.info('\nINFO: (Re)start of process...')
      })

      build.onEnd(({ errors }) => {
        if (errors.length > 0) {
          // eslint-disable-next-line no-console
          console.info('INFO: Process will not be (re)started due to error.')

          return
        }

        if (serverProcess) serverProcess.kill()

        serverProcess = spawn('node', [outfile], { stdio: 'inherit' })
      })
    },
  }

  const ctx = await esbuild.context({
    entryPoints: [source],
    treeShaking: true,
    minifySyntax: false,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    // Bundling `bee-queue` inside the run package would result in an error
    //
    //    Error: node_redis: The EVALSHA command contains a invalid argument
    //    type of "undefined".
    //
    // We rather install it seperately.
    external: ['bee-queue'],
    outfile,
    plugins: [graphqlLoaderPlugin(), startServerPlugin],
  })

  await ctx.watch({})
}
