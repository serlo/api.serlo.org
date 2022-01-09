/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
/* eslint-disable */
const typescript = require('rollup-plugin-typescript2')
const ttypescript = require('ttypescript')

module.exports = {
  rollup(config, options) {
    const rpt2Plugin = config.plugins.find((p) => p.name === 'rpt2')
    const rpt2PluginIndex = config.plugins.indexOf(rpt2Plugin)

    const tsconfigPath = options.tsconfig || 'tsconfig.json'

    // borrowed from https://github.com/facebook/create-react-app/pull/7248
    const tsconfigJSON = ttypescript.readConfigFile(
      tsconfigPath,
      ttypescript.sys.readFile
    ).config

    const tsCompilerOptions = ttypescript.parseJsonConfigFileContent(
      tsconfigJSON,
      ttypescript.sys,
      './'
    ).options

    const customRPT2Plugin = typescript({
      typescript: ttypescript,
      tsconfig: options.tsconfig,
      tsconfigDefaults: {
        exclude: [
          // TS defaults below,
          '../../node_modules',
          'node_modules',
          'dist',
        ],
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          jsx: 'react',
        },
      },
      tsconfigOverride: {
        compilerOptions: {
          // TS -> esnext, then leave the rest to babel-preset-env
          target: 'esnext',
          // don't output declarations more than once
          ...(!options.writeMeta
            ? { declaration: false, declarationMap: false }
            : {}),
        },
      },
      check: !options.transpileOnly && options.writeMeta,
      useTsconfigDeclarationDir: Boolean(
        tsCompilerOptions && tsCompilerOptions.declarationDir
      ),
    })

    config.plugins.splice(rpt2PluginIndex, 1, customRPT2Plugin)
    return config
  },
}
