/**
 * UnaryOperation ::=
 *   UnaryOperator Expression
 */
export default class UnaryOperation {
  constructor (
    operator,
    expression
  ) {
    this.operator = operator
    this.expression = expression
  }

  get begin () {
    return this.operator.begin
  }

  get end () {
    return this.expression.end
  }
}
