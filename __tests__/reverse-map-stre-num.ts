import { reverseMapStrEnum } from '../src/graphql/schema/utils'

enum TestStringEnum {
  Element = 'ELEMENT',
  Another = 'ANOTHER',
}

test('reverse map string enum', () => {
  expect(reverseMapStrEnum('ELEMENT', TestStringEnum)).toEqual(
    TestStringEnum.Element
  )
  expect(reverseMapStrEnum('ANOTHER', TestStringEnum)).toEqual(
    TestStringEnum.Another
  )
  expect(reverseMapStrEnum('AnythingElse', TestStringEnum)).toEqual(undefined)
})
