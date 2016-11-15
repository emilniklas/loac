/**
 * BinaryOperation ::=
 *   Expression BinaryOperator Expression
 */
export default class BinaryOperation {
  constructor (
    lhs,
    operator,
    rhs
  ) {
    this.lhs = lhs
    this.operator = operator
    this.rhs = rhs
  }
}
