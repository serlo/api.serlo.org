import graphqlLoaderPlugin_ from '@luckycatfactory/esbuild-graphql-loader'
import { defaultImport } from 'default-import'
import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const graphqlLoaderPlugin = defaultImport(graphqlLoaderPlugin_)

await main()

async function main() {
  const { source, outfile } = loadSourceAndOutput()

  await esbuild.build(getEsbuildOptions(source, outfile))
}

export function loadSourceAndOutput() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const root = path.join(__dirname, '..')
  const dist = path.join(root, 'dist')
  const [sourceArg, targetArg] = process.argv.slice(2)

  const source = path.resolve(sourceArg)

  if (!fs.statSync(source).isFile()) {
    throw new Error(`File ${source} does not exist`)
  }

  const outfile = path.join(dist, targetArg)

  return { source, outfile }
}

export function getEsbuildOptions(source: string, outfile: string) {
  return {
    entryPoints: [source],
    treeShaking: true,
    minifySyntax: false,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    sourcemap: 'linked',
    // Bundling `bee-queue` inside the run package would result in an error
    //
    //    Error: node_redis: The EVALSHA command contains a invalid argument
    //    type of "undefined".
    //
    // We rather install it seperately.
    external: ['bee-queue'],
    outfile,
    plugins: [graphqlLoaderPlugin()],
  } as esbuild.BuildOptions
}
