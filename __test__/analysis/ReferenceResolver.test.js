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
        declaration('p', [2, 7]), null,
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
        declaration('p', [2, 7]), null,
        [ reference('p', [3, 15]) ]
      ),
      new References(
        declaration("p'", [2, 10]), null,
        [ reference("p'", [4, 15]) ]
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
