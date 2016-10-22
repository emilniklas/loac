/**
 * InterfaceDeclaration ::=
 *   INTERFACE_KEYWORD
 *   SimpleIdentifier
 *   Interfaces?
 *   ObjectBody?
 */
export default class InterfaceDeclaration {
  constructor (
    keyword,
    identifier,
    interfaces = null,
    body = null
  ) {
    this.keyword = keyword
    this.identifier = identifier
    this.interfaces = interfaces
    this.body = body
  }
}
