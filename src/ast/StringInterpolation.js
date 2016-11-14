/**
 * StringInterpolation ::=
 *   BEGIN_CURLY_BRACE
 *   Expression
 *   END_CURLY_BRACE
 */
export default class StringInterpolation {
  constructor (
    beginCurly,
    expression,
    endCurly
  ) {
    this.beginCurly = beginCurly
    this.expression = expression
    this.endCurly = endCurly
  }
}
