import ReferenceResolver from '../../src/analysis/ReferenceResolver'
import References from '../../src/analysis/References'
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
      new References(
        declaration('p', [2, 7]), null, 0,
        [ reference('p', [3, 15]) ]
      )
    ])
  })

  test('two parameters', () => {
    assertFunctionReferences(`
      (p, p') {
        return p
        return p'
      }
    `, [
      new References(
        declaration('p', [2, 7]), null, 0,
        [ reference('p', [3, 15]) ]
      ),
      new References(
        declaration("p'", [2, 10]), null, 0,
        [ reference("p'", [4, 15]) ]
      )
    ])
  })

  test('two references', () => {
    assertFunctionReferences(`
      (p) {
        return p
        return p
      }
    `, [
      new References(
        declaration('p', [2, 7]), null, 0,
        [
          reference('p', [3, 15]),
          reference('p', [4, 15])
        ]
      )
    ])
  })

  test('let statement', () => {
    assertFunctionReferences(`
      () {
        let d = 123
        return d
      }
    `, [
      new References(
        declaration('d', [3, 12]), null, 1,
        [ reference('d', [4, 15]) ]
      )
    ])
  })

  test('if statement', () => {
    assertFunctionReferences(`
      (a) {
        if a {
          let b = 123
          return b
        }
      }
    `, [
      new References(
        declaration('a', [2, 7]), null, 0,
        [
          reference('a', [3, 11])
        ]
      ),
      new References(
        declaration('b', [4, 14]), null, 2,
        [ reference('b', [5, 17]) ]
      )
    ])
  })

  test('same name two scopes', () => {
    assertFunctionReferences(`
      (a) {
        if a {
          let b = 123
          return b
        }
        if a {
          let b = 123
          return b
        }
      }
    `, [
      new References(
        declaration('a', [2, 7]), null, 0,
        [
          reference('a', [3, 11]),
          reference('a', [7, 11])
        ]
      ),
      new References(
        declaration('b', [4, 14]), null, 2,
        [ reference('b', [5, 17]) ]
      ),
      new References(
        declaration('b', [8, 14]), null, 2,
        [ reference('b', [9, 17]) ]
      )
    ])
  })

  test('nested same name', () => {
    assertFunctionReferences(`
      (a, b) {
        if a {
          let b = 123
          return b
        }
        return b
      }
    `, [
      new References(
        declaration('a', [2, 7]), null, 0,
        [ reference('a', [3, 11]) ]
      ),
      new References(
        declaration('b', [2, 10]), null, 0,
        [ reference('b', [7, 15]) ]
      ),
      new References(
        declaration('b', [4, 14]), null, 2,
        [ reference('b', [5, 17]) ]
      )
    ])
  })

  test('inner function', () => {
    assertFunctionReferences(`
      (a) {
        let f () {
          let b = a
          return b
        }
        return a
      }
    `, [
      new References(
        declaration('a', [2, 7]), null, 0,
        [
          reference('a', [4, 18]),
          reference('a', [7, 15])
        ]
      ),
      new References(
        declaration('f', [3, 12]), null, 1, []
      ),
      new References(
        declaration('b', [4, 14]), null, 2,
        [ reference('b', [5, 17]) ]
      )
    ])
  })
})

function declaration (content, [line, column]) {
  return new ast.NamePattern(
    new ast.SimpleIdentifier({
      type: tokens.SYMBOL,
      content: content,
      location: ['<unknown>', line, column]
    })
  )
}

function reference (content, [line, column]) {
  return new ast.ValueExpression(
    new ast.SimpleIdentifier({
      type: tokens.SYMBOL,
      content: content,
      location: ['<unknown>', line, column]
    })
  )
}

function assertFunctionReferences (code, expected) {
  expect(functionReferences(code)).toEqual(expected)
}

function functionReferences (code) {
  return ReferenceResolver.resolve(
    Parser.load(Lexer.tokenize(code))
      ._parseFunctionExpression()
  )
}
