/**
 * ObjectDeclaration ::=
 *   SimpleIdentifier
 *   Generics?
 *   (COLON TypeArgument)?
 *   ObjectBody?
 */
export default class ObjectDeclaration {
  constructor (
    identifier,
    generics = null,
    typeArgument = null,
    body = null
  ) {
    this.identifier = identifier
    this.generics = generics
    this.typeArgument = typeArgument
    this.body = body
  }

  get begin () {
    return this.identifier.begin
  }

  get end () {
    return (this.body || this.typeArgument || this.generics || this.identifier).end
  }
}
