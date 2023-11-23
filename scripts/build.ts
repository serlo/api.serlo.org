import graphqlLoaderPlugin from '@luckycatfactory/esbuild-graphql-loader'
import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

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

  await esbuild.build({
    entryPoints: [source],
    treeShaking: true,
    minifySyntax: false,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    outfile,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    // @ts-expect-error
    plugins: [graphqlLoaderPlugin.default()],
  })
}
