import * as ast from '../ast'
import References from './References'

export default class ReferenceResolver {
  constructor (ast, references) {
    this._ast = ast
    this._references = references
  }

  static resolve (ast, references = []) {
    return new ReferenceResolver(ast, references)
      ._resolve()._references
  }

  _resolve () {
    switch (this._ast.constructor) {
      case ast.FunctionExpression:
        return this._resolveFunctionExpression()
    }
    throw new Error(`TODO: Accept ${this._ast.constructor.name} nodes`)
  }

  _copy ({ ast, references }) {
    return new ReferenceResolver(
      ast || this._ast,
      references || this._references
    )
  }

  _move (ast) {
    return this._copy({ ast })
  }

  _load (references) {
    return this._copy({
      references: this._references.concat(references)
    })
  }

  _resolveFunctionExpression () {
    return this._move(this._ast.parameterList)
      ._resolveParameterList()
      ._move(this._ast.body)
      ._resolveFunctionBody()
  }

  _resolveParameterList () {
    return this._ast.patterns.reduce(
      (resolver, pattern) =>
        resolver._move(pattern)._resolveTypedPattern(),
      this
    )
  }

  _resolveTypedPattern () {
    return this._declaration(
      this._ast.pattern,
      this._ast.typeArgument
    )
  }

  _declaration (pattern, typeArgument) {
    return this._load([
      new References(pattern, typeArgument)
    ])
  }

  _resolveFunctionBody () {
    return this._ast.statements.reduce(
      (resolver, statement) => {
        if (statement instanceof ast.ReturnStatement) {
          return resolver
            ._move(statement.expression)
            ._resolveExpression()
        }

        return resolver
      },
      this
    )
  }

  _resolveExpression () {
    if (this._ast instanceof ast.ValueExpression) {
      return this._reference(this._ast)
    }
    return this
  }

  _reference (value) {
    return this._copy({
      references: this._references.map((r) => {
        if (r.declaration.identifier.symbol.content
          == value.identifier.symbol.content) {
          return r.addReference(value)
        }
        return r
      })
    })
  }
}
