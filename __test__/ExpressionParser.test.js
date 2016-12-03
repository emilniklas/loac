import ExpressionParser from '../src/ExpressionParser'
import Lexer from '../src/Lexer'
import * as ast from '../src/ast'
import * as ir from '../src/ir'

const THREE = ir.integer(3)
const FOUR = ir.integer(4)
const FIVE = ir.integer(5)

describe('ExpressionParser', () => {
  test('simple integer value', () => {
    assertExpression(
      '3',
      new ast.IntegerLiteralExpression(THREE)
    )
  })

  test('negative number', () => {
    assertExpression(
      '-3',
      new ast.UnaryOperation(
        new ast.UnaryOperator(ir.MINUS_SIGN),
        new ast.IntegerLiteralExpression(THREE)
      )
    )
  })

  test('simple binary operation', () => {
    assertExpression(
      '3 - 4',
      new ast.BinaryOperation(
        new ast.IntegerLiteralExpression(THREE),
        new ast.BinaryOperator(ir.MINUS_SIGN),
        new ast.IntegerLiteralExpression(FOUR)
      )
    )
  })

  test('invalid suffix operator', () => {
    expect(() => ExpressionParser.parse(
      removeWhitespace(Lexer.tokenize('3 +'))
    )).toThrow('ParserError: Expected an expression, saw EOF ""')
  })

  test('invalid multiple operators', () => {
    expect(() => ExpressionParser.parse(
      removeWhitespace(Lexer.tokenize('3 + + 3'))
    )).toThrow('ParserError: Expected an expression, saw PLUS_SIGN "+"')
  })

  test('same operator multi operator expression', () => {
    assertExpression(
      '3 - 4 - 5',
      new ast.BinaryOperation(
        new ast.BinaryOperation(
          new ast.IntegerLiteralExpression(THREE),
          new ast.BinaryOperator(ir.MINUS_SIGN),
          new ast.IntegerLiteralExpression(FOUR)
        ),
        new ast.BinaryOperator(ir.MINUS_SIGN),
        new ast.IntegerLiteralExpression(FIVE)
      )
    )
  })

  test('different operator multi operator expression', () => {
    assertExpression(
      '3 - 4 * 5',
      new ast.BinaryOperation(
        new ast.IntegerLiteralExpression(THREE),
        new ast.BinaryOperator(ir.MINUS_SIGN),
        new ast.BinaryOperation(
          new ast.IntegerLiteralExpression(FOUR),
          new ast.BinaryOperator(ir.STAR),
          new ast.IntegerLiteralExpression(FIVE)
        )
      )
    )
  })

  test('double unary', () => {
    assertExpression(
      '--3',
      new ast.UnaryOperation(
        new ast.UnaryOperator(ir.MINUS_SIGN),
        new ast.UnaryOperation(
          new ast.UnaryOperator(ir.MINUS_SIGN),
          new ast.IntegerLiteralExpression(THREE)
        )
      )
    )
  })

  test('object access', () => {
    assertExpression(
      'a.b.c',
      new ast.BinaryOperation(
        new ast.BinaryOperation(
          new ast.ValueExpression(ir.simpleIdentifier('a')),
          new ast.BinaryOperator(ir.PERIOD),
          new ast.ValueExpression(ir.simpleIdentifier('b'))
        ),
        new ast.BinaryOperator(ir.PERIOD),
        new ast.ValueExpression(ir.simpleIdentifier('c'))
      )
    )
  })

  test('unit', () => {
    assertExpression(
      '()',
      ir.unitExpression
    )
  })

  test('simple call', () => {
    assertExpression(
      'f()',
      new ast.CallExpression(
        new ast.ValueExpression(ir.simpleIdentifier('f')),
        ir.unitExpression,
      )
    )
  })

  test('method call', () => {
    assertExpression(
      'o.m()',
      new ast.CallExpression(
        new ast.BinaryOperation(
          new ast.ValueExpression(ir.simpleIdentifier('o')),
          new ast.BinaryOperator(ir.PERIOD),
          new ast.ValueExpression(ir.simpleIdentifier('m'))
        ),
        ir.unitExpression,
      )
    )
  })

  test('method call in arithmetic expression', () => {
    assertExpression(
      '3 + o.m() * 4',
      new ast.BinaryOperation(
        new ast.IntegerLiteralExpression(THREE),
        new ast.BinaryOperator(ir.PLUS_SIGN),
        new ast.BinaryOperation(
          new ast.CallExpression(
            new ast.BinaryOperation(
              new ast.ValueExpression(ir.simpleIdentifier('o')),
              new ast.BinaryOperator(ir.PERIOD),
              new ast.ValueExpression(ir.simpleIdentifier('m'))
            ),
            ir.unitExpression,
          ),
          new ast.BinaryOperator(ir.STAR),
          new ast.IntegerLiteralExpression(FOUR)
        )
      )
    )
  })

  test('calling a tuple literal', () => {
    assertExpression(
      '(x)(3)',
      new ast.CallExpression(
        new ast.TupleLiteralExpression(
          ir.BEGIN_PAREN,
          [new ast.ValueExpression(ir.simpleIdentifier('x'))],
          ir.END_PAREN
        ),
        new ast.TupleLiteralExpression(
          ir.BEGIN_PAREN,
          [new ast.IntegerLiteralExpression(THREE)],
          ir.END_PAREN
        )
      )
    )
  })

  test('boolean literals', () => {
    assertExpression(
      'false or true',
      new ast.BinaryOperation(
        new ast.BoolLiteralExpression(ir.FALSE_KEYWORD),
        new ast.BinaryOperator(ir.OR_KEYWORD),
        new ast.BoolLiteralExpression(ir.TRUE_KEYWORD)
      )
    )
  })

  test('boolean negation and arithmetic', () => {
    assertExpression(
      'not false and true',
      new ast.BinaryOperation(
        new ast.UnaryOperation(
          new ast.UnaryOperator(ir.NOT_KEYWORD),
          new ast.BoolLiteralExpression(ir.FALSE_KEYWORD)
        ),
        new ast.BinaryOperator(ir.AND_KEYWORD),
        new ast.BoolLiteralExpression(ir.TRUE_KEYWORD)
      )
    )
  })
})

function assertExpression (expression, expected) {
  expect(ExpressionParser.parse(
    removeLocation(
      removeWhitespace(
        Lexer.tokenize(expression)
      )
    )
  )).toEqual(expected)
}

function removeLocation (tokens) {
  return tokens.map(({ type, content }) => ir.token(type, content))
}

function removeWhitespace (tokens) {
  return tokens.filter(({ type }) => type !== 'WHITESPACE')
}
