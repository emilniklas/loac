import * as ast from '../ast'
import References from './References'

export default class ReferenceResolver {
  constructor (ast, references, level = 0) {
    this._ast = ast
    this._references = references
    this._level = level
  }

  static resolve (ast, references = []) {
    return new ReferenceResolver(ast, references)
      ._resolve()._references
  }

  _resolve () {
    switch (this._ast.constructor) {
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
        return this._reference(this._ast)
      case ast.Assignment:
        return this._resolveAssignment()
      case ast.FunctionDeclaration:
        return this._resolveFunctionDeclaration()
    }
    throw new Error(`TODO: Accept ${this._ast.constructor.name} nodes`)
  }

  _copy ({ ast, references, level }) {
    return new ReferenceResolver(
      ast || this._ast,
      references || this._references,
      level || this._level
    )
  }

  _move (ast) {
    return this._copy({ ast })
  }

  _levelUp () {
    return this._copy({
      level: this._level + 1
    })
  }

  _levelDown () {
    return this._copy({
      level: this._level - 1
    })
  }

  _load (references) {
    return this._copy({
      references: this._references.concat(references)
    })
  }

  _resolveProgram () {
    return this._ast.topLevelDeclarations.reduce(
      (resolver, declaration) => resolver
        ._move(declaration)
        ._resolveTopLevelDeclaration(),
      this
    )
  }

  _resolveTopLevelDeclaration () {
    return this
      ._move(this._ast.declaration)
      ._resolve()
  }

  _resolveFunctionExpression () {
    return this._move(this._ast.parameterList)
      ._resolveParameterList()
      ._levelUp()
      ._move(this._ast.body)
      ._resolveFunctionBody()
      ._levelDown()
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
    if (this._alreadyLoaded(pattern)) {
      return this
    }

    return this._load([
      new References(pattern, typeArgument, this._level)
    ])
  }

  _alreadyLoaded (pattern) {
    return this._references.reduce(
      (isLoaded, references) => {
        return isLoaded ||
          references.declaration === pattern
      },
      false
    )
  }

  _resolveFunctionBody () {
    return this._ast.statements
      .reduce(
        (resolver, statement) => {
          return resolver._move(statement)._resolve()
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
    if (this._alreadyAdded(value)) {
      return this
    }
    const [foundDeclaration, references] = this._references.reduceRight(([done, references], r) => {
      const hasntFoundMatch = !done
      const hasSameSymbol = r.declaration == null
        ? r.references[0].identifier.symbol.content ===
            value.identifier.symbol.content
        : r.declaration.identifier.symbol.content ===
            value.identifier.symbol.content
      const isNotOutOfScope = r.level <= this._level

      if (
        hasntFoundMatch &&
        hasSameSymbol &&
        isNotOutOfScope
      ) {
        return [true,
          [r.addReference(value)].concat(references)
        ]
      }
      return [done, [r].concat(references)]
    }, [false, []])

    if (!foundDeclaration) {
      return this._load([
        new References(null, null, this._level)
          .addReference(value)
      ])
    }

    return this._copy({
      references
    })
  }

  _alreadyAdded (value) {
    return this._references.reduce(
      (isAdded, references) => {
        return isAdded ||
          references.references.reduce(
            (isAdded, reference) => isAdded ||
              reference === value,
            false
          )
      },
      false
    )
  }

  _resolveReturnStatement () {
    return this
      ._move(this._ast.expression)
      ._resolveExpression()
  }

  _resolveLetStatement () {
    return this
      ._move(this._ast.declaration)
      ._resolve()
  }

  _resolveIfStatement () {
    return this
      ._move(this._ast.expression)
      ._levelUp()
      ._resolveExpression()
      ._move(this._ast.body)
      ._resolveFunctionBody()
      ._levelDown()
    // const innerReferences = ReferenceResolver.resolve(
    //   this._ast.body,
    //   this._references
    // )

    // return this._copy({
    //   references: innerReferences.reduce(
    //     (all, ref) => {
    //       if (this._alreadyLoaded(ref.declaration)) {
    //         return all
    //       }
    //       return all.concat(ref)
    //     },
    //     this._references
    //   )
    // })
  }

  _resolveAssignment () {
    return this
      ._move(this._ast.pattern)
      ._resolveTypedPattern()
      ._move(this._ast.expression)
      ._resolveExpression()
  }

  _resolveFunctionDeclaration () {
    const type = this._ast.returnType == null
      ? null
      : this._ast.returnType.typeArgument

    return this
      ._declaration(
        new ast.NamePattern(this._ast.identifier),
        type
      )
      ._move(this._ast.functionExpression)
      ._resolveFunctionExpression()
  }
}
