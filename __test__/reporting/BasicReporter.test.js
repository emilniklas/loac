import BasicReporter from '../../src/reporting/BasicReporter'
import Lexer from '../../src/Lexer'
import * as ast from '../../src/ast'
import * as tok from '../../src/tokens'

import SyntaxError from '../../src/errors/SyntaxError'
import ParserError from '../../src/errors/ParserError'
import OptimizerError from '../../src/errors/OptimizerError'

describe('BasicReporter', () => {
  test('syntax error', () => {
    assertBasicReport([
      new SyntaxError(
        'myfile.loa',
        'abc',
        1,
        'This is not a real syntax error'
      )
    ], [
      'myfile.loa:1:1: error: This is not a real syntax error'
    ])
  })

  test('parser error', () => {
    assertBasicReport([
      new ParserError(
        'myfile.loa',
        'abc',
        Lexer.tokenize('abc'),
        0,
        'This is not a real parser error'
      )
    ], [
      'myfile.loa:1:0: error: This is not a real parser error'
    ])
  })

  describe('optimizer errors', () => {
    const astNode = new ast.Program(
      null,
      [],
      [
        new ast.TopLevelDeclaration(
          [],
          new ast.Visibility({
            type: tok.PUBLIC_KEYWORD,
            content: 'public',
            location: ['myfile.loa', 1, 0]
          }),
          new ast.FunctionDeclaration(
            new ast.SimpleIdentifier({
              type: tok.SYMBOL,
              content: 'f',
              location: ['myfile.loa', 1, 7]
            }),
            new ast.FunctionExpression(
              new ast.ParameterList({
                type: tok.BEGIN_PAREN,
                content: '(',
                location: ['myfile.loa', 1, 9]
              }, [], {
                type: tok.END_PAREN,
                content: ')',
                location: ['myfile.loa', 1, 10]
              })
            )
          )
        )
      ]
    )

    test('error', () => {
      assertBasicReport([
        new OptimizerError(
          OptimizerError.ERROR,
          'myfile.loa',
          'public f ()',
          astNode,
          'This is not a real optimizer error'
        )
      ], [
        'myfile.loa:1:0: error: This is not a real optimizer error'
      ])
    })

    test('warning', () => {
      assertBasicReport([
        new OptimizerError(
          OptimizerError.WARNING,
          'myfile.loa',
          'public f ()',
          astNode,
          'This is not a real optimizer warning'
        )
      ], [
        'myfile.loa:1:0: warning: This is not a real optimizer warning'
      ])
    })

    test('hint', () => {
      assertBasicReport([
        new OptimizerError(
          OptimizerError.HINT,
          'myfile.loa',
          'public f ()',
          astNode,
          'This is not a real optimizer hint'
        )
      ], [
        'myfile.loa:1:0: hint: This is not a real optimizer hint'
      ])
    })
  })
})

function assertBasicReport (messages, lines) {
  expect(BasicReporter.report(messages))
      .toEqual(lines)
}
