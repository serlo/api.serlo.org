import { transform } from 'esbuild'

/**
 * @param {string | Uint8Array} src
 * @param {string} filename
 */
async function processAsync(src, filename) {
  const result = await transform(src, {
    loader: filename.endsWith('.ts') ? 'ts' : 'js',
    format: 'esm',
    target: 'node20',
    sourcemap: true,
  })
  return {
    code: result.code,
    map: result.map,
  }
}

// eslint-disable-next-line import/no-default-export
export default { processAsync }
