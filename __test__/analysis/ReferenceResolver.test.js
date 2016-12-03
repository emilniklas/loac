import ReferenceResolver from '../../src/analysis/ReferenceResolver'
import ReferenceBinding from '../../src/analysis/ReferenceBinding'
import Lexer from '../../src/Lexer'
import Parser from '../../src/Parser'
import * as ast from '../../src/ast'
import * as tokens from '../../src/tokens'

describe('ReferenceResolver', () => {
  test('it resolves references', () => {
    assertFunctionReferences(`
      (p) {
        return p
      }
    `, [
      [[2, 7], [3, 15]]
    ])
  })

  test('multiple references', () => {
    assertFunctionReferences(`
      (p) {
        return p
        return p
      }
    `, [
      [[2, 7], [3, 15]],
      [[2, 7], [4, 15]]
    ])
  })

  test('multiple declarations', () => {
    assertFunctionReferences(`
      (p, p') {
        return p
        return p'
      }
    `, [
      [[2, 7], [3, 15]],
      [[2, 10], [4, 15]]
    ])
  })

  test('if statement', () => {
    assertFunctionReferences(`
      (cond) {
        if cond {
          return cond
        }
        return cond
      }
    `, [
      [[2, 7], [3, 11]],
      [[2, 7], [4, 17]],
      [[2, 7], [6, 15]]
    ])
  })

  test('inner scoped declaration', () => {
    assertFunctionReferences(`
      (cond) {
        if cond {
          let inner = 123
          return inner
        }
        return cond
      }
    `, [
      [[2, 7], [3, 11]],
      [[4, 14], [5, 17]],
      [[2, 7], [7, 15]]
    ])
  })

  test('inner scope declaration with same name', () => {
    assertFunctionReferences(`
      (var) {
        if var {
          let var = 123
          return var
        }
        return var
      }
    `, [
      [[2, 7], [3, 11]],
      [[4, 14], [5, 17]],
      [[2, 7], [7, 15]]
    ])
  })

  test('multiple inner scopes', () => {
    assertFunctionReferences(`
      (var) {
        if var {
          let var = 123
          return var
        }
        if var {
          let var = 123
          return var
        }
        return var
      }
    `, [
      [[2, 7], [3, 11]],
      [[4, 14], [5, 17]],
      [[2, 7], [7, 11]],
      [[8, 14], [9, 17]],
      [[2, 7], [11, 15]]
    ])
  })

  test('inner inner scopes', () => {
    assertFunctionReferences(`
      (var) {
        if var {
          let var = 123
          if var {
            let var = 123
            return var
          }
          return var
        }
        return var
      }
    `, [
      [[2, 7], [3, 11]],
      [[4, 14], [5, 13]],
      [[6, 16], [7, 19]],
      [[4, 14], [9, 17]],
      [[2, 7], [11, 15]]
    ])
  })

  test('type reference', () => {
    assertProgramReferences(`
      private interface T
      public const t: T
    `, [
      [[2, 24], [3, 22]],
      [[3, 19], [NaN, NaN]]
    ])
  })

  test('type subtype references', () => {
    assertProgramReferences(`
      private interface T
      private interface U: T
      public const t: U
    `, [
      [[2, 24], [3, 27]],
      [[3, 24], [4, 22]],
      [[4, 19], [NaN, NaN]]
    ])
  })

  test('unordered type reference', () => {
    assertProgramReferences(`
      private interface U: T
      private interface T
    `, [
      [[3, 24], [2, 27]],
      [[2, 24], [NaN, NaN]]
    ])
  })

  test('unordered const type reference', () => {
    assertProgramReferences(`
      private const c: T
      private interface T
    `, [
      [[3, 24], [2, 23]],
      [[2, 20], [NaN, NaN]]
    ])
  })

  test('use imports', () => {
    assertProgramReferences(`
      use This.Thing.T
      private interface U: T
    `, [
      [[2, 10], [3, 27]],
      [[3, 24], [NaN, NaN]]
    ])
  })

  test('type arguments', () => {
    assertProgramReferences(`
      public f () -> T
      private interface T
    `, [
      [[3, 24], [2, 21]],
      [[2, 13], [NaN, NaN]]
    ])
  })

  test('undefined value', () => {
    assertFunctionReferences(`
      () {
        return a
      }
    `, [
      [[NaN, NaN], [3, 15]]
    ])
  })

  test('unused declaration', () => {
    assertFunctionReferences(`
      () {
        let a = 123
        return 123
      }
    `, [
      [[3, 12], [NaN, NaN]]
    ])
  })
})

function assertFunctionReferences (code, expected) {
  assertReferences(code, (p) => p._parseFunctionExpression(), expected)
}

function assertProgramReferences (code, expected) {
  assertReferences(code, (p) => p._parseProgram(), expected)
}

function assertReferences (code, parse, expected) {
  const bindings = ReferenceResolver.resolve(
    parse(Parser.load('<unknown>', code, Lexer.tokenize(code)))
  ).map((binding) => [
    binding.declarationLocation.slice(1),
    binding.referenceLocation.slice(1)
  ])

  expect(bindings).toEqual(expected)
}
