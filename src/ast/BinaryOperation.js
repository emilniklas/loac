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

  get begin () {
    return this.lhs.begin
  }

  get end () {
    return this.rhs.end
  }
}
