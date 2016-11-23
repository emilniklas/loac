import * as ast from '../ast'
import ReferenceBinding from './ReferenceBinding'

export default class ReferenceResolver {
  constructor ({
    node,
    bindings,
    level = 0,
    scopes = [[]],
  }) {
    this._node = node
    this._bindings = bindings
    this._level = level
    this._scopes = scopes
  }

  static resolve (node, bindings = []) {
    return new ReferenceResolver({ node, bindings })
      ._resolve()._bindings
  }

  _resolve () {
    switch (this._node.constructor) {
      case ast.Program:
        return this._resolveProgram()
      case ast.FunctionExpression:
        return this._resolveFunctionExpression()
      case ast.BlockFunctionBody:
        return this._resolveFunctionBody()
      case ast.ReturnStatement:
        return this._resolveReturnStatement()
      case ast.LetStatement:
        return this._resolveLetStatement()
      case ast.IfStatement:
        return this._resolveIfStatement()
      case ast.ValueExpression:
        return this._reference(this._node)
      case ast.Assignment:
        return this._resolveAssignment()
      case ast.FunctionDeclaration:
        return this._resolveFunctionDeclaration()
    }
    throw new Error(`TODO: Accept ${this._node.constructor.name} nodes`)
  }

  _copy (changes) {
    return new ReferenceResolver(
      Object.assign({}, {
        ast: this._node,
        level: this._level,
        scopes: this._scopes,
        bindings: this._bindings
      }, changes)
    )
  }

  _move (node) {
    return this._copy({ node })
  }

  _levelUp () {
    return this._copy({
      level: this._level + 1,
      scopes: [
        ...this._scopes,
        [] // inner scope
      ]
    })
  }

  _levelDown () {
    return this._copy({
      level: this._level - 1,
      scopes: this._scopes.slice(0, this._level)
    })
  }

  _declaration (declaration, type = null) {
    return this._copy({
      scopes: [
        ...this._scopes.slice(0, this._level),
        [
          ...this._scopes[this._level],
          new ReferenceBinding(declaration, type)
        ]
      ]
    })
  }

  _reference (reference) {
    const partialBinding = this._scopes
      .reduceRight((all, scope) => all.concat(scope)) // Flatten
      .reduce((found, partial) => {
        if (found != null) {
          return found
        }

        // console.log(partial, reference)

        if (partial.declarationMatchesReference(reference)) {
          return partial
        }
      }, null)

    if (partialBinding == null) {
      return this._copy({
        bindings: [
          ...this._bindings,
          new ReferenceBinding(null, null, reference)
        ]
      })
    }

    return this._copy({
      bindings: [
        ...this._bindings,
        partialBinding.bind(reference)
      ]
    })
  }

  _resolveProgram () {
    return this._node.topLevelDeclarations.reduce(
      (resolver, declaration) => resolver
        ._move(declaration)
        ._resolveTopLevelDeclaration(),
      this
    )
  }

  _resolveTopLevelDeclaration () {
    return this
      ._move(this._node.declaration)
      ._resolve()
  }

  _resolveFunctionExpression () {
    const parser = this._move(this._node.parameterList)
      ._resolveParameterList()

    if (this._node.body == null) {
      return parser
    }

    return parser
      ._levelUp()
      ._move(this._node.body)
      ._resolveFunctionBody()
      ._levelDown()
  }

  _resolveParameterList () {
    return this._node.patterns.reduce(
      (resolver, pattern) =>
        resolver._move(pattern)._resolveTypedPattern(),
      this
    )
  }

  _resolveTypedPattern () {
    return this._declaration(
      this._node.pattern,
      this._node.typeArgument
    )
  }

  _resolveFunctionBody () {
    return this._node.statements
      .reduce(
        (resolver, statement) => {
          return resolver._move(statement)._resolve()
        },
        this
      )
  }

  _resolveExpression () {
    if (this._node instanceof ast.ValueExpression) {
      return this._reference(this._node)
    }
    return this
  }

  _resolveReturnStatement () {
    return this
      ._move(this._node.expression)
      ._resolveExpression()
  }

  _resolveLetStatement () {
    return this
      ._move(this._node.declaration)
      ._resolve()
  }

  _resolveIfStatement () {
    return this
      ._move(this._node.expression)
      ._resolveExpression()
      ._levelUp()
      ._move(this._node.body)
      ._resolveFunctionBody()
      ._levelDown()
  }

  _resolveAssignment () {
    return this
      ._move(this._node.pattern)
      ._resolveTypedPattern()
      ._move(this._node.expression)
      ._resolveExpression()
  }

  _resolveFunctionDeclaration () {
    const type = this._node.returnType == null
      ? null
      : this._node.returnType.typeArgument

    return this
      ._declaration(
        new ast.NamePattern(this._node.identifier),
        type
      )
      ._move(this._node.functionExpression)
      ._resolveFunctionExpression()
  }
}
