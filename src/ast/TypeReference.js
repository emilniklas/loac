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

  get begin () {
    return this.identifier.begin
  }

  get end () {
    return (this.typeArguments || this.identifier).end
  }
}
