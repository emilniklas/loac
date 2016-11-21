/**
 * ListTypeArgument ::=
 *   BEGIN_SQUARE_BRACKET
 *   TypeArgument
 *   END_SQUARE_BRACKET
 */
export default class ListTypeArgument {
  constructor (
    beginBracket,
    typeArgument,
    endBracket
  ) {
    this.beginBracket = beginBracket
    this.typeArgument = typeArgument
    this.endBracket = endBracket
  }

  get begin () {
    return this.beginBracket
  }

  get end () {
    return this.endBracket
  }
}
