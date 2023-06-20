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
