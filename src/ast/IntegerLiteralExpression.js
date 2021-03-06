/**
 * IntegerLiteralExpression ::=
 *   INTEGER_LITERAL
 */
export default class IntegerLiteralExpression {
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
