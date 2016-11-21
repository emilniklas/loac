/**
 * FloatLiteralExpression ::=
 *   FLOAT_LITERAL
 */
export default class FloatLiteralExpression {
  constructor (
    literal
  ) {
    this.literal = literal
  }

  get begin () {
    return this.literal
  }

  get end () {
    return this.literal
  }
}
