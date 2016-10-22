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
}
