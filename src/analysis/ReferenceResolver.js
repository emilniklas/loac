import * as ast from '../ast'
import * as ir from '../ir'
import ReferenceBinding from './ReferenceBinding'
import OptimizerError from '../errors/OptimizerError'

const ANY_TYPE = ir.typeReference('Any')

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
    if (this._node == null) {
      return this
    }

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
      case ast.Assignment:
        return this._resolveAssignment()
      case ast.FunctionDeclaration:
        return this._resolveFunctionDeclaration()
      case ast.ConstantDeclaration:
        return this._resolveConstantDeclaration()
      case ast.TopLevelDeclaration:
        return this._resolveTopLevelDeclaration()
      case ast.TypedPattern:
        return this._resolveTypedPattern()
      case ast.ParameterList:
        return this._resolveParameterList()
      case ast.TupleLiteralExpression:
        return this._resolveTupleLiteralExpression()
      case ast.UseStatement:
        return this._resolveUseStatement()
      case ast.ReturnType:
        return this._resolveReturnType()

      // Null leaf nodes
      case ast.IntegerLiteralExpression:
      case ast.FloatLiteralExpression:
        return this

      // Reference leaf nodes
      case ast.ValueExpression:
      case ast.TypeReference:
        return this._reference(this._node)
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
      scopes: this._scopes.slice(0, this._level),
      bindings: this._bindings.concat(
        ...this._scopes.slice(this._level)[0].filter(({ declaration }) =>
          this._bindings
            .filter((b) =>
              b.declaration === declaration
            )
            .length === 0
        )
      )
    })
  }

  _findPartial (reference) {
    return this._scopes
      .reduceRight((all, scope) => all.concat(scope)) // Flatten
      .reduce((found, partial) => {
        if (found != null) {
          return found
        }

        if (partial.declarationMatchesReference(reference)) {
          return partial
        }
      }, null)
  }

  _declaration (declaration, type = null) {
    if (type != null) {
      type = this._findPartial(type) || type
    }
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
    if (reference == null) {
      return this
    }

    const partialBinding = this._findPartial(reference)

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

  _inferType (expression) {
    if (expression == null) {
      return ir.typeReference('Unit')
    }

    switch (expression.constructor) {
      case ast.IntegerLiteralExpression:
        return ir.typeReference('Int')

      default:
        return null
    }
  }

  _resolveProgram () {
    const header = this._node.useStatements.reduce(
      (resolver, statement) => resolver
        ._move(statement)
        ._resolve(),
      this._levelUp()
    )

    const early = this._node.topLevelDeclarations.reduce(
      (resolver, declaration) => resolver
        ._move(declaration)
        ._resolveTopLevelEarlyDeclaration(),
      header
    )

    return this._node.topLevelDeclarations.reduce(
      (resolver, declaration) => resolver
        ._move(declaration)
        ._resolveTopLevelDeclaration(),
      early
    )._levelDown()
  }

  _resolveTopLevelEarlyDeclaration () {
    const declaration = this._move(this._node.declaration)

    switch (this._node.declaration.constructor) {
      case ast.InterfaceDeclaration:
        return declaration._resolveInterfaceEarlyDeclaration()
      case ast.FunctionDeclaration:
        return declaration._resolveFunctionEarlyDeclaration()
      case ast.ConstantDeclaration:
        return declaration._resolveConstantEarlyDeclaration()
      default:
        throw new Error(`TODO: Accept ${this._node.declaration.constructor.name} nodes`)
    }
  }

  _resolveTopLevelDeclaration () {
    const declaration = this._move(this._node.declaration)

    switch (this._node.declaration.constructor) {
      case ast.InterfaceDeclaration:
        return declaration._resolveInterfaceDeclaration()
      case ast.FunctionDeclaration:
        return declaration._resolveFunctionDeclaration()
      case ast.ConstantDeclaration:
        return declaration._resolveConstantDeclaration()
      default:
        throw new Error(`TODO: Accept ${this._node.declaration.constructor.name} nodes`)
    }
  }

  _resolveFunctionExpression () {
    const parser = this._move(this._node.parameterList)
      ._resolve()

    return parser
      ._levelUp()
      ._move(this._node.returnType)
      ._resolve()
      ._move(this._node.body)
      ._resolve()
      ._levelDown()
  }

  _resolveParameterList () {
    return this._node.patterns.reduce(
      (resolver, pattern) =>
        resolver._move(pattern)._resolve(),
      this
    )
  }

  _resolveTypedPattern (inferType = null) {
    return this
      ._move(this._node.typeArgument)
      ._resolve()
      ._declaration(
        this._node.pattern,
        this._node.typeArgument || (
          inferType != null
            ? inferType()
            : ANY_TYPE
        )
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
      ._resolve()
  }

  _resolveLetStatement () {
    return this
      ._move(this._node.declaration)
      ._resolve()
  }

  _resolveIfStatement () {
    return this
      ._move(this._node.expression)
      ._resolve()
      ._levelUp()
      ._move(this._node.body)
      ._resolve()
      ._levelDown()
  }

  _resolveAssignment () {
    return this
      ._move(this._node.pattern)
      ._resolveTypedPattern(this._inferType.bind(this, this._node.expression))
      ._move(this._node.expression)
      ._resolve()
  }

  _resolveFunctionEarlyDeclaration () {
    const type = this._node.returnType == null
      ? null
      : this._node.returnType.typeArgument

    return this
      ._declaration(
        new ast.NamePattern(this._node.identifier),
        type
      )
  }

  _resolveFunctionDeclaration () {
    return this
      ._move(this._node.functionExpression)
      ._resolve()
  }

  _resolveConstantEarlyDeclaration () {
    return this
      ._declaration(this._node.assignment.pattern.pattern)
  }

  _resolveConstantDeclaration () {
    return this
      ._move(this._node.assignment.pattern.typeArgument)
      ._resolve()
  }

  _resolveInterfaceEarlyDeclaration () {
    return this._declaration(this._node)
  }

  _resolveInterfaceDeclaration () {
    return this
      ._move(this._node.typeArgument)
      ._resolve()
  }

  _resolveTupleLiteralExpression () {
    return this._node.expressions.reduce((acc, expression) =>
      acc._move(expression)._resolve(),
      this
    )
  }

  _resolveUseStatement () {
    return this._declaration(this._node.qualifiedIdentifier)
  }

  _resolveReturnType () {
    return this
      ._move(this._node.typeArgument)
      ._resolve()
  }
}
