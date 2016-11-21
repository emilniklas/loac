/**
 * UnionTypeArgument ::=
 *   TypeArgument
 *   (PIPE TypeArgument)+
 */
export default class UnionTypeArgument {
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
