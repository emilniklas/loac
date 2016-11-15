/**
 * CallExpression ::=
 *   Expression
 *   TupleLiteralExpression
 */
export default class CallExpression {
  constructor (
    expression,
    argumentList
  ) {
    this.expression = expression
    this.argumentList = argumentList
  }
}
