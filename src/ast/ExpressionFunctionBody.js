/**
 * ExpressionFunctionBody ::=
 *   FAT_ARROW
 *   Expression
 */
export default class ExpressionFunctionBody {
  constructor (
    arrow,
    expression
  ) {
    this.arrow = arrow
    this.expression = expression
  }

  get begin () {
    return this.arrow
  }

  get end () {
    return this.expression.end
  }
}
