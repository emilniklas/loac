/**
 * TypeReference ::=
 *   Identifier
 *   TypeArguments?
 */
export default class TypeReference {
  constructor (
    identifier,
    typeArguments = null
  ) {
    this.identifier = identifier
    this.typeArguments = typeArguments
  }
}
