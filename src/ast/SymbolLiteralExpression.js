/**
 * SymbolLiteralExpression ::=
 *   HASH
 *   Identifier
 */
export default class SymbolLiteralExpression {
  constructor (
    hash,
    identifier
  ) {
    this.hash = hash
    this.identifier = identifier
  }

  get begin () {
    return this.hash
  }

  get end () {
    return this.identifier.end
  }
}
