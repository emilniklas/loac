import ExpressionParser from '../src/ExpressionParser'
import Lexer from '../src/Lexer'
import * as ast from '../src/ast'
import { integer, token, MINUS_SIGN, STAR } from '../src/ir'

const THREE = integer(3)
const FOUR = integer(4)
const FIVE = integer(5)

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
        new ast.UnaryOperator(MINUS_SIGN),
        new ast.IntegerLiteralExpression(THREE)
      )
    )
  })

  test('simple binary operation', () => {
    assertExpression(
      '3 - 4',
      new ast.BinaryOperation(
        new ast.IntegerLiteralExpression(THREE),
        new ast.BinaryOperator(MINUS_SIGN),
        new ast.IntegerLiteralExpression(FOUR)
      )
    )
  })

  test('same operator multi operator expression', () => {
    assertExpression(
      '3 - 4 - 5',
      new ast.BinaryOperation(
        new ast.BinaryOperation(
          new ast.IntegerLiteralExpression(THREE),
          new ast.BinaryOperator(MINUS_SIGN),
          new ast.IntegerLiteralExpression(FOUR)
        ),
        new ast.BinaryOperator(MINUS_SIGN),
        new ast.IntegerLiteralExpression(FIVE)
      )
    )
  })

  test('different operator multi operator expression', () => {
    assertExpression(
      '3 - 4 * 5',
      new ast.BinaryOperation(
        new ast.IntegerLiteralExpression(THREE),
        new ast.BinaryOperator(MINUS_SIGN),
        new ast.BinaryOperation(
          new ast.IntegerLiteralExpression(FOUR),
          new ast.BinaryOperator(STAR),
          new ast.IntegerLiteralExpression(FIVE)
        )
      )
    )
  })

  test('double unary', () => {
    assertExpression(
      '--3',
      new ast.UnaryOperation(
        new ast.UnaryOperator(MINUS_SIGN),
        new ast.UnaryOperation(
          new ast.UnaryOperator(MINUS_SIGN),
          new ast.IntegerLiteralExpression(THREE)
        )
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
  return tokens.map(({ type, content }) => token(type, content))
}

function removeWhitespace (tokens) {
  return tokens.filter(({ type }) => type !== 'WHITESPACE')
}
