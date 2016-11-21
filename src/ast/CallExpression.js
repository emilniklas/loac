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

  get begin () {
    return this.expression.begin
  }

  get end () {
    return this.argumentList.end
  }
}
