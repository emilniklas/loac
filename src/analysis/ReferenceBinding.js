import * as ast from '../ast'

export default class ReferenceBinding {
  constructor (declaration, reference = null, visibility = null, type = null) {
    this.declaration = declaration
    this.reference = reference
    this.visibility = visibility
    this.type = type
  }

  bind (reference) {
    return new ReferenceBinding(
      this.declaration,
      reference,
      this.visibility,
      this.type
    )
  }

  declareType (type) {
    return new ReferenceBinding(
      this.declaration,
      this.reference,
      this.visibility,
      type
    )
  }

  declareVisibility (visibility) {
    return new ReferenceBinding(
      this.declaration,
      this.reference,
      visibility,
      this.type
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

  get hasLocations () {
    if (this.isPartial) {
      return false
    }
    return !(
      isNaN(
        this._resolveLocation(this.reference)[1] +
        this._resolveLocation(this.declaration)[1]
      )
    )
  }

  get isPartial () {
    return this.declaration == null ||
      this.reference == null
  }

  declarationMatchesReference (reference) {
    return this._resolveName(this.declaration) ===
      this._resolveName(reference)
  }

  hasDeclaration (declaration) {
    if (declaration == null || this.declaration == null) {
      return false
    }
    return this._resolveSymbol(declaration) ===
      this._resolveSymbol(this.declaration)
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
    if (node == null) {
      return { type: null, content: '', location: [null, NaN, NaN] }
    }
    switch (node.constructor) {
      case ast.NamePattern:
      case ast.ValueExpression:
      case ast.InterfaceDeclaration:
      case ast.FunctionDeclaration:
      case ast.TypeReference:
        return this._resolveSymbol(node.identifier)

      case ast.UseStatement:
        return this._resolveSymbol(node.qualifiedIdentifier)

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
