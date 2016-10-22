/**
 * FutureTypeArgument ::=
 *   STAR
 *   TypeArgument
 */
export default class FutureTypeArgument {
  constructor (
    star,
    typeArgument
  ) {
    this.star = star
    this.typeArgument = typeArgument
  }
}
