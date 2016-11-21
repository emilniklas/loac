/**
 * TupleTypeArgument ::=
 *   BEGIN_PAREN
 *   (TypeArgument COMMA?)*
 *   END_PAREN
 */
export default class TupleTypeArgument {
  constructor (
    beginParen,
    typeArguments,
    endParen
  ) {
    this.beginParen = beginParen
    this.typeArguments = typeArguments
    this.endParen = endParen
  }

  get begin () {
    return this.beginParen
  }

  get end () {
    return this.endParen
  }
}
