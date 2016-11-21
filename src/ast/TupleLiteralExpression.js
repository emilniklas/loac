/**
 * TupleLiteralExpression ::=
 *   BEGIN_PAREN
 *   (Expression COMMA?)*
 *   END_PAREN
 */
export default class TupleLiteralExpression {
  constructor (
    beginParen,
    expressions = [],
    endParen
  ) {
    this.beginParen = beginParen
    this.expressions = expressions
    this.endParen = endParen
  }

  get begin () {
    return this.beginParen
  }

  get end () {
    return this.endParen
  }
}
