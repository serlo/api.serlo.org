import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'

import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const root = path.join(__dirname, '..')
const src = path.join(root, 'src')
const outputDir = path.join(root, 'migrations')

await main()

async function main() {
  for (const arg of process.argv.slice(2)) {
    const file = path.resolve(arg)

    if (!fs.statSync(file).isFile() || path.dirname(file) !== src) {
      throw new Error(`File ${file} does not exist`)
    }

    const basename = path.basename(file, '.ts')
    const outfile = path.join(outputDir, `${basename}.js`)

    await esbuild.build({
      entryPoints: [file],
      treeShaking: true,
      minifySyntax: false,
      bundle: true,
      platform: 'node',
      format: 'cjs',
      target: 'node20',
      outfile,
    })
  }
}
