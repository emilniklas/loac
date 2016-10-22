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
}
