import * as t from 'io-ts'
import * as R from 'ramda'

export function replacePlugins(transformations: {
  [key in string]?: (args: {
    plugin: Plugin
    applyChangeToChildren: Transformation
  }) => Plugin
}): Transformation {
  return updatePlugins((plugin, applyChangeToChildren) => {
    const transformFunc = transformations[plugin.plugin]

    if (typeof transformFunc === 'function') {
      return transformFunc({ plugin, applyChangeToChildren })
    }
  })
}

export function replacePluginState(transformations: {
  [key in string]?: (args: {
    state: unknown
    applyChangeToChildren: Transformation
  }) => unknown
}): Transformation {
  return updatePlugins(({ plugin, state }, applyChangeToChildren) => {
    const transformFunc = transformations[plugin]

    if (typeof transformFunc === 'function') {
      return { plugin, state: transformFunc({ state, applyChangeToChildren }) }
    }
  })
}

function updatePlugins(
  updatePlugin: (
    plugin: Plugin,
    applyChangeToChildren: Transformation,
  ) => Plugin | undefined,
): Transformation {
  function applyChangeToChildren(value: unknown): unknown {
    if (isPlugin(value)) {
      const newPlugin = updatePlugin(value, applyChangeToChildren)

      if (newPlugin) return newPlugin
    }

    if (Array.isArray(value)) {
      return value.map(applyChangeToChildren)
    }

    if (typeof value === 'object' && value !== null) {
      return R.mapObjIndexed(applyChangeToChildren, value)
    }

    return value
  }

  return applyChangeToChildren
}

export function transformAllPlugins(transformFunc: ListTransformation<Plugin>) {
  return transformRecursively((value) => {
    if (isPlugin(value)) {
      const transformedPlugin = transformFunc(value)
      return transformedPlugin
    }
  })
}

export function transformPlugins(transformations: {
  [key in string]?: ListTransformation<Plugin>
}) {
  return transformLists((value) => {
    if (isPlugin(value)) {
      const transformFunc = transformations[value.plugin]

      if (typeof transformFunc === 'function') {
        return transformFunc(value)
      }
    }
  })
}

export function transformSlateTypes(transformations: {
  [key in string]?: ListTransformation<SlateNode>
}) {
  return transformLists((value) => {
    if (SlateNodeDecoder.is(value)) {
      const transformFunc = transformations[value.type]

      if (typeof transformFunc === 'function') {
        return transformFunc(value)
      }
    }
  })
}

/**
 * Transforms objects and arrays recursively
 */
function transformRecursively(
  transform: ListTransformation<unknown>,
): Transformation {
  function applyTransformation(value: unknown): unknown {
    if (Array.isArray(value)) {
      const newValue = value.flatMap((element) => {
        const transformation = transform(element)

        return transformation !== undefined ? transformation : [element]
      })

      return newValue.map(applyTransformation)
    }

    if (typeof value === 'object' && value !== null) {
      const newValue = transform(value)
      if (newValue && newValue[0]) {
        return R.mapObjIndexed(applyTransformation, newValue[0])
      }

      return R.mapObjIndexed(applyTransformation, value)
    }

    return value
  }

  return applyTransformation
}

/**
 * Only transforms lists, not objects.
 */
function transformLists(
  transform: ListTransformation<unknown>,
): Transformation {
  function applyTransformation(value: unknown): unknown {
    if (Array.isArray(value)) {
      const newValue = value.flatMap((element) => {
        const transformation = transform(element)

        return transformation !== undefined ? transformation : [element]
      })

      return newValue.map(applyTransformation)
    }

    if (typeof value === 'object' && value !== null) {
      return R.mapObjIndexed(applyTransformation, value)
    }

    return value
  }

  return applyTransformation
}

type ListTransformation<A> = (element: A) => A[] | undefined

export function isPlugin(value: unknown): value is Plugin {
  return (
    R.has('plugin', value) &&
    R.has('state', value) &&
    typeof value.plugin === 'string'
  )
}

export type Transformation = (value: unknown) => unknown

export interface Plugin {
  plugin: string
  state: unknown
  id?: string
}

const SlateNodeDecoder = t.type({ type: t.string })
type SlateNode = t.TypeOf<typeof SlateNodeDecoder>
