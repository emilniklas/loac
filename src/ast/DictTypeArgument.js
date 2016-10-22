/**
 * DictTypeArgument ::=
 *   BEGIN_SQUARE_BRACKET
 *   TypeArgument
 *   COLON
 *   TypeArgument
 *   END_SQUARE_BRACKET
 */
export default class DictTypeArgument {
  constructor (
    beginBracket,
    keyTypeArgument,
    colon,
    valueTypeArgument,
    endBracket
  ) {
    this.beginBracket = beginBracket
    this.keyTypeArgument = keyTypeArgument
    this.colon = colon
    this.valueTypeArgument = valueTypeArgument
    this.endBracket = endBracket
  }
}
