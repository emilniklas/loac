/**
 * IntersectionTypeArgument ::=
 *   TypeArgument
 *   (AMPERSAND TypeArgument)+
 */
export default class IntersectionTypeArgument {
  constructor (
    typeArguments
  ) {
    this.typeArguments = typeArguments
  }

  get begin () {
    return this.typeArguments[0].begin
  }

  get end () {
    return this.typeArguments[this.typeArguments.length - 1].end
  }
}
