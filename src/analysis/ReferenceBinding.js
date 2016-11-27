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

  get name () {
    return this._resolveName(
      this.declaration ||
      this.reference
    )
  }

  declarationMatchesReference (reference) {
    return this._resolveName(this.declaration) ===
      this._resolveName(reference)
  }

  _resolveLocation (node) {
    if (node == null) {
      return ['<unknown>', NaN, NaN]
    }
    const token = this._resolveSymbol(node)

    if (token instanceof ast.QualifiedIdentifier) {
      return token.begin.location
    }

    return token.location
  }

  _resolveName (node) {
    if (node == null) {
      return 'none'
    }
    const token = this._resolveSymbol(node)

    if (token instanceof ast.QualifiedIdentifier) {
      return token.simpleIdentifier.symbol.content
    }

    return token.content
  }

  _resolveSymbol (node) {
    switch (node.constructor) {
      case ast.NamePattern:
      case ast.ValueExpression:
      case ast.InterfaceDeclaration:
      case ast.TypeReference:
        return this._resolveSymbol(node.identifier)

      case ast.ConstantDeclaration:
        return this._resolveSymbol(node.assignment)

      case ast.Assignment:
      case ast.TypedPattern:
        return this._resolveSymbol(node.pattern)

      case ast.QualifiedIdentifier:
        return node

      case ast.SimpleIdentifier:
        return node.symbol

      default:
        throw new Error(
          `ReferenceBinding could not get symbol from ${node.constructor.name}`
        )
    }
  }
}
