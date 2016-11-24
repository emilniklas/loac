/**
 * InterfaceDeclaration ::=
 *   INTERFACE_KEYWORD
 *   SimpleIdentifier
 *   Generics?
 *   (COLON TypeArgument)?
 *   ObjectBody?
 */
export default class InterfaceDeclaration {
  constructor (
    keyword,
    identifier,
    generics = null,
    typeArgument = null,
    body = null
  ) {
    this.keyword = keyword
    this.identifier = identifier
    this.generics = generics
    this.typeArgument = typeArgument
    this.body = body
  }

  get begin () {
    return this.keyword
  }

  get end () {
    return (this.body || this.typeArgument || this.generics || this.identifier).end
  }
}
