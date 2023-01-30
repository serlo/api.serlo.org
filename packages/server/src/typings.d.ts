/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
// Needed to include "package.json" into source files and avoiding emitting
// them to the `dist`
//
// See https://stackoverflow.com/a/61426303
//
// FIXME: Find a solution with `resolveJsonModule === true` and omitting the
// error https://github.com/jaredpalmer/tsdx/blob/f0963cb2d77f00bcd8606f8e4b99250972d81b02/src/deprecated.ts#L13-L21
declare module '*.json' {
  export const version: string
}
