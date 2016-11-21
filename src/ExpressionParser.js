import Parser from './Parser'
import * as t from './tokens'
import * as ast from './ast'
import ParserError from './errors/ParserError'

const EXPECTS_OPERAND = 'EXPECTS_OPERAND'
const EXPECTS_OPERATOR = 'EXPECTS_OPERATOR'

export default class ExpressionParser {
  constructor (parser) {
    this._parser = parser
  }

  static parse (tokens) {
    return new ExpressionParser(new Parser('<unknown>', '', tokens))
      .parse()
  }

  parse () {
    let segments = []

    while (this._isExpressionHead || this._isOperator) {
      const segment = this._parseExpressionSegment()
      segments.push(segment)

      if (
        !(segment instanceof ast.Operator) &&
        this._isExpressionHead &&
        !this._parser._is(t.BEGIN_PAREN)
      ) {
        break
      }
    }
    return this._parseOperatorExpressionTree(segments)
  }

  get _isExpressionHead () {
    switch (this._parser._current.type) {
      case t.INTEGER_LITERAL:
      case t.FLOAT_LITERAL:
      case t.BEGIN_SQUARE_BRACKET:
      case t.DOUBLE_QUOTE:
      case t.SINGLE_QUOTE:
      case t.SYMBOL:
      case t.BEGIN_PAREN:
      case t.TRUE_KEYWORD:
      case t.FALSE_KEYWORD:
        return true
      default:
        return false
    }
  }

  get _isOperator () {
    switch (this._parser._current.type) {
      case t.BEGIN_PAREN:
      case t.DASH:
      case t.NOT_KEYWORD:
      case t.WAIT_KEYWORD:
      case t.DOUBLE_EQUALS:
      case t.BEGIN_ANGLE_BRACKET:
      case t.END_ANGLE_BRACKET:
      case t.REVERSE_FAT_ARROW:
      case t.FUNNEL:
      case t.AND_KEYWORD:
      case t.OR_KEYWORD:
      case t.PLUS_SIGN:
      case t.DASH:
      case t.SLASH:
      case t.STAR:
      case t.PERCENT_SIGN:
      case t.CARET:
      case t.PERIOD:
      case t.AS_KEYWORD:
      case t.IS_KEYWORD:
        return true
      default:
        return false
    }
  }

  /**
   * Expression ::=
   *   ( IntegerLiteralExpression
   *   | FloatLiteralExpression
   *   | ListLiteralExpression
   *   | DictLiteralExpression
   *   | StringLiteralExpression
   *   | CharLiteralExpression
   *   | TupleLiteralExpression
   *   | BoolLiteralExpression
   *   | ValueExpression
   *   | FunctionExpression
   *   | CallExpression
   *   )
   */
  _parseExpressionSegment () {
    switch (this._parser._current.type) {
      case t.INTEGER_LITERAL:
        return this._parser._parseIntegerLiteralExpression()
      case t.FLOAT_LITERAL:
        return this._parser._parseFloatLiteralExpression()
      case t.BEGIN_SQUARE_BRACKET:
        return this._parser._parseListOrDictExpression()
      case t.DOUBLE_QUOTE:
        return this._parser._parseStringLiteralExpression()
      case t.SINGLE_QUOTE:
        return this._parser._parseCharLiteralExpression()
      case t.SYMBOL:
        return this._parser._parseValueExpression()
      case t.BEGIN_PAREN:
        return this._parser._parseTupleOrFunctionExpression()
      case t.TRUE_KEYWORD:
      case t.FALSE_KEYWORD:
        return this._parser._parseBoolLiteralExpression()

      // Since a dash can be used as both a prefix
      // and an infix operator, we need to treat it as a
      // special case.
      case t.DASH:
        return new ast.Operator(this._parser._move())

      case t.NOT_KEYWORD:
      case t.WAIT_KEYWORD:
        return new ast.UnaryOperator(this._parser._move())

      case t.DOUBLE_EQUALS:
      case t.BEGIN_ANGLE_BRACKET:
      case t.END_ANGLE_BRACKET:
      case t.REVERSE_FAT_ARROW:
      case t.FUNNEL:
      case t.AND_KEYWORD:
      case t.OR_KEYWORD:
      case t.PLUS_SIGN:
      case t.SLASH:
      case t.STAR:
      case t.PERCENT_SIGN:
      case t.CARET:
      case t.PERIOD:
      case t.AS_KEYWORD:
      case t.IS_KEYWORD:
        return new ast.BinaryOperator(this._parser._move())

      default:
        this._parser._parserError(
          'Expected an expression'
        )
    }
  }

  _parseOperatorExpressionTree (allSegments) {
    let state = EXPECTS_OPERAND
    let segments = allSegments.concat()
    let binary = []
    let unary = []
    let operands = []

    const lastUnary = () =>
      unary[unary.length - 1]
    const lastBinary = () =>
      binary[binary.length - 1]
    const lastOperand = () =>
      operands[operands.length - 1]

    const hasUnary = () =>
      unary.length > 0
    const hasBinary = () =>
      binary.length > 0

    while (segments.length > 0) {
      const segment = segments.shift()

      switch (state) {
        case EXPECTS_OPERAND:
          if (this._isUnaryOperator(segment)) {
            unary.push(this._ensureUnaryOperator(segment))
          } else {
            operands.push(segment)
            state = EXPECTS_OPERATOR
          }
          break
        case EXPECTS_OPERATOR:
          if (segment instanceof ast.TupleLiteralExpression) {
            if (hasBinary() && lastBinary().token.type === t.PERIOD) {
              const rhs = operands.pop()
              const lhs = operands.pop()
              operands.push(
                new ast.BinaryOperation(
                  lhs,
                  binary.pop(),
                  rhs,
                )
              )
            }
            operands.push(
              new ast.CallExpression(
                operands.pop(),
                segment
              )
            )
            continue
          }

          const operator = this._ensureBinaryOperator(segment)

          if (hasUnary() && lastUnary().precedes(operator)) {
            operands.push(
              new ast.UnaryOperation(
                unary.pop(),
                operands.pop()
              )
            )
          }

          if (hasBinary() && lastBinary().precedes(operator)) {
            const rhs = operands.pop()
            const lhs = operands.pop()
            operands.push(
              new ast.BinaryOperation(
                lhs,
                binary.pop(),
                rhs,
              )
            )
          }
          binary.push(operator)
          state = EXPECTS_OPERAND
          break
      }
    }

    while (unary.length > 0) {
      operands.push(
        new ast.UnaryOperation(
          unary.pop(),
          operands.pop()
        )
      )
    }

    while (binary.length > 0) {
      const rhs = operands.pop()
      const lhs = operands.pop()
      operands.push(
        new ast.BinaryOperation(
          lhs,
          binary.pop(),
          rhs
        )
      )
    }

    return lastOperand()
  }

  _isUnaryOperator (operator) {
    return operator instanceof ast.Operator ||
      operator instanceof ast.UnaryOperator
  }

  _ensureUnaryOperator (operator) {
    if (!(operator instanceof ast.UnaryOperator)) {
      return new ast.UnaryOperator(operator.token)
    }
    return operator
  }

  _ensureBinaryOperator (operator) {
    if (!(operator instanceof ast.BinaryOperator)) {
      return new ast.BinaryOperator(operator.token)
    }
    return operator
  }
}
