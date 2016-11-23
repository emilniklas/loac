import * as ast from '../ast'

export default class ReferenceBinding {
  constructor (declaration, type = null, reference = null) {
    this.declaration = declaration
    this.type = type
    this.reference = reference
  }

  bind (reference) {
    return new ReferenceBinding(
      this.declaration,
      this.type,
      reference
    )
  }

  get declarationLocation () {
    return this._resolveLocation(this.declaration)
  }

  get referenceLocation () {
    return this._resolveLocation(this.reference)
  }

  declarationMatchesReference (reference) {
    return this._resolveName(this.declaration) ===
      this._resolveName(reference)
  }

  _resolveLocation (node) {
    return this._resolveSymbol(node).location
  }

  _resolveName (node) {
    return this._resolveSymbol(node).content
  }

  _resolveSymbol (node) {
    switch (node.constructor) {
      case ast.NamePattern:
      case ast.ValueExpression:
        return node.identifier.symbol

      default:
        throw new Error(
          `ReferenceBinding could not get symbol from ${node.constructor.name}`
        )
    }
  }
}
