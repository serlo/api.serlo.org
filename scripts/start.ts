import { spawn, ChildProcess } from 'child_process'
import * as esbuild from 'esbuild'

import { getEsbuildOptions, loadSourceAndOutput } from './build'

await main()

async function main() {
  const { source, outfile } = loadSourceAndOutput()

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

        serverProcess = spawn('node', ['--enable-source-maps', outfile], {
          stdio: 'inherit',
        })
      })
    },
  }

  const { plugins = [], ...options } = getEsbuildOptions(source, outfile)

  const ctx = await esbuild.context({
    ...options,
    plugins: [...plugins, startServerPlugin],
  })

  await ctx.watch({})
}
