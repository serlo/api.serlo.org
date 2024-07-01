export function toSqlTuple(elements: Array<string | number>): string {
  return '(' + elements.map((e) => JSON.stringify(e)).join(', ') + ')'
}
