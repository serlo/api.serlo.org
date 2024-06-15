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
  const args =
    process.argv.slice(2).length > 0
      ? process.argv.slice(2)
      : fs.readdirSync(src).filter((file) => file.endsWith('.ts'))

  for (const arg of args) {
    const file = path.join(src, path.basename(arg))

    if (!fs.statSync(file).isFile()) {
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
      external: ['db-migrate'],
      outfile,
    })
  }
}
