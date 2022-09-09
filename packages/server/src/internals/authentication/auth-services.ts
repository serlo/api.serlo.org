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
import { Configuration as KratosConfig, V0alpha2Api } from '@ory/client'
import { AdminApi, Configuration as HydraConfig } from '@ory/hydra-client'

export interface AuthServices {
  kratos: {
    public: V0alpha2Api
    admin: V0alpha2Api
  }
  hydra: AdminApi
}

export function initiateAuthSdks(): AuthServices {
  return {
    kratos: {
      public: new V0alpha2Api(
        new KratosConfig({
          basePath: process.env.SERVER_KRATOS_PUBLIC_HOST,
        })
      ),

      admin: new V0alpha2Api(
        new KratosConfig({
          basePath: process.env.SERVER_KRATOS_ADMIN_HOST,
        })
      ),
    },
    hydra: new AdminApi(
      new HydraConfig({
        basePath: process.env.SERVER_HYDRA_HOST,
        baseOptions: {
          headers: { 'X-Forwarded-Proto': 'https' },
        },
      })
    ),
  }
}
