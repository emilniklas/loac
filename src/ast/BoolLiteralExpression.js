/**
 * BoolLiteralExpression ::=
 *   TRUE_KEYWORD | FALSE_KEYWORD
 */
export default class BoolLiteralExpression {
  constructor (
    token
  ) {
    this.token = token
  }
}
