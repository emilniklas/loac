/**
 * StringLiteralExpression ::=
 *   DOUBLE_QUOTE
 *   ( AnyToken
 *   | StringInterpolation
 *   )*
 *   DOUBLE_QUOTE
 */
export default class StringLiteralExpression {
  constructor (
    beginQuote,
    parts,
    endQuote
  ) {
    this.beginQuote = beginQuote
    this.parts = parts
    this.endQuote = endQuote
  }

  get begin () {
    return this.beginQuote
  }

  get end () {
    return this.endQuote
  }
}
