/**
 * CharLiteralExpression ::=
 *   SINGLE_QUOTE
 *   AnyToken
 *   SINGLE_QUOTE
 */
export default class CharLiteralExpression {
  constructor (
    beginQuote,
    char,
    endQuote
  ) {
    this.beginQuote = beginQuote
    this.char = char
    this.endQuote = endQuote
  }

  get begin () {
    return this.beginQuote
  }

  get end () {
    return this.endQuote
  }
}
