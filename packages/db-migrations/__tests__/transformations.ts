import { v4 as uuidv4 } from 'uuid'
import { isPlugin, transformAllPlugins } from '../src/utils/serlo-editor'

// Object has some ids, but not all of them are present
// prettier-ignore
const testObject = {"plugin":"exercise","state":{"content":{"plugin":"rows","state":[{"plugin":"multimedia","state":{"explanation":{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"Calcula la "},{"text":"superficie","strong":true},{"text":" del octógono verde "}]},{"type":"p","children":[{"text":"ABCDEFGH"}]}],"id":"14c6fef1-ba97-4719-a4f8-126cd14b9474"}]},"multimedia":{"plugin":"image","state":{"src":"https://assets.serlo.org/5f6094962ea20_ab58fa07328f2c8f939555fc6c62a319ea86929a.png","caption":{"plugin":"text","state":[{"type":"p","children":[{}]}]}}},"illustrating":true,"width":50},"id":"e3a51356-7ce9-49cc-84c9-46203fc43613"}]},"interactive":{"plugin":"inputExercise","state":{"type":"input-string-normalized-match-challenge","unit":"","answers":[{"value":"25","isCorrect":true,"feedback":{"plugin":"text","state":[{"type":"p","children":[{"text":""},{"type":"math","src":"cm^2","inline":true,"children":[{"text":"cm^2"}]},{"text":""}]}]}}]}},"solution":{"plugin":"solution","state":{"prerequisite":{"id":"53434","title":"Área de las figuras compuestas"},"strategy":{"plugin":"text","state":[{"type":"p","children":[{}]}]},"steps":{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{}]}],"id":"f863fde9-502c-41c0-896c-d5544e46ee5b"}]}}}}}

function checkAllPluginsHaveIDs(plugin: any): boolean {
  if (isPlugin(plugin) && !plugin.id) {
    return false
  }
  if (plugin.state && typeof plugin.state === 'object') {
    return Object.values(plugin.state).every(checkAllPluginsHaveIDs)
  }
  return true
}

describe('transformations', () => {
  test('transformAllPlugins works on all plugins recursively', async () => {
    const assignUUIDs = (plugin: any) => {
      if (!plugin.id) {
        return [{ ...plugin, id: uuidv4() }]
      }

      return [plugin]
    }

    // Initial object should not have all IDs.
    expect(checkAllPluginsHaveIDs(testObject)).toBeFalsy()

    const transformedContent = transformAllPlugins(assignUUIDs)(testObject)

    // Transformed object should have all ids
    expect(checkAllPluginsHaveIDs(transformedContent)).toBeTruthy()
  })
})
