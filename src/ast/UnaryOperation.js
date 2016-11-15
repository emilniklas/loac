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
}
