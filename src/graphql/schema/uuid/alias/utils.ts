export function decodePath(path: string) {
  return decodeURIComponent(path)
}

export function encodePath(path: string) {
  return encodeURIComponent(path).replace(/%2F/g, '/')
}
