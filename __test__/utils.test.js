import * as utils from '../src/utils'

class A {
  constructor (a) {
    this.a = a
  }
}
class B {
  constructor (a) {
    this.a = a
  }
}

const expectDeep = (a, b, v) => expect(utils.deepEquals(a, b)).toBe(v)
const expectEqual = (a, b) => expectDeep(a, b, true)
const expectNotEqual = (a, b) => expectDeep(a, b, false)

test('deepEquals', () => {
  expectEqual(1, 1)
  expectNotEqual(1, 2)
  expectEqual([1], [1])
  expectNotEqual([1], [2])

  expectEqual({ a: 1 }, { a: 1 })
  expectNotEqual({ a: 1 }, { a: 2 })
  expectNotEqual({ a: 1 }, { b: 1 })

  expectEqual({ a: { a: 1 } }, { a: { a: 1 } })
  expectNotEqual({ a: { a: 1 } }, { a: { b: 1 } })
  expectNotEqual({ a: { a: 1 } }, { a: { a: 2 } })

  expectEqual(new A(1), new A(1))
  expectNotEqual(new A(1), new A(2))
  expectNotEqual(new A(1), new B(1))

  expectEqual(new A([1, 2]), new A([1, 2]))
  expectNotEqual(new A([1, 2]), new A([1, 1]))
  expectNotEqual(new A([1, 2]), new B([1, 2]))
})

class ClassWithLocation {
  constructor (location) {
    this.location = location
  }
}

test('special case: ignores location in plain objects', () => {
  expectEqual(new ClassWithLocation([1, 2]), new ClassWithLocation([1, 2]))
  expectNotEqual(new ClassWithLocation([1, 2]), new ClassWithLocation([1, 3]))

  expectEqual({ location: [1, 2] }, { location: [1, 2] })
  expectEqual({ location: [1, 2] }, { location: [1, 3] })
})
