/**
 * InterfaceDeclaration ::=
 *   INTERFACE_KEYWORD
 *   ObjectDeclaration
 */
export default class InterfaceDeclaration {
  constructor (
    keyword,
    declaration
  ) {
    this.keyword = keyword
    this.declaration = declaration
  }

  get begin () {
    return this.keyword
  }

  get end () {
    return this.declaration.end
  }
}
