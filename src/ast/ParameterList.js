/**
 * ParameterList ::=
 *   BEGIN_PAREN
 *   (TypedPattern COMMA?)*
 *   END_PAREN
 */
export default class ParameterList {
  constructor (
    beginParen,
    patterns = [],
    endParen
  ) {
    this.beginParen = beginParen
    this.patterns = patterns
    this.endParen = endParen
  }
}
