/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

import { Model } from '~/internals/graphql'

export class Database {
  private uuids: Record<number, Model<'AbstractUuid'> | undefined> = {}

  public getUuid(id: number) {
    return this.uuids[id]
  }

  public changeUuid(id: number, update: Partial<Model<'AbstractUuid'>>) {
    this.uuids[id] = { ...this.uuids[id], ...(update as Model<'AbstractUuid'>) }
  }

  public deleteUuid(id: number) {
    delete this.uuids[id]
  }

  public hasUuid(uuid: Model<'AbstractUuid'>) {
    // A copy of the uuid is created here so that changes of the uuid object in
    // the `uuids` database does not affect the passed object
    this.uuids[uuid.id] = { ...uuid }
  }

  public hasUuids(uuids: Model<'AbstractUuid'>[]) {
    for (const uuid of uuids) {
      this.hasUuid(uuid)
    }
  }
}
