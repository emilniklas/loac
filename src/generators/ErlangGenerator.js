import * as ast from '../ast'

export default class ErlangGenerator {
  constructor (filePath, ast) {
    this._filePath = filePath
    this._ast = ast
    this._runtimeImports = []
    this._exports = []
  }

  static emit (filePath, ast) {
    return new ErlangGenerator(filePath, ast)
      ._emitProgram()
  }

  _emitProgram () {
    const declarations = this._ast.topLevelDeclarations
      .map(this._emitTopLevelDeclaration.bind(this))
      .join('\n\n')
    const exports = this._exports.length === 0
      ? ''
      : `-export([${this._exports.join(', ')}]).`
    const runtimeImports = this._runtimeImports.length === 0
      ? ''
      : `-import(loa_runtime, [${this._runtimeImports.join(', ')}]).`
    const module = this._emitModuleStatement(
      this._ast.moduleStatement
    )
    const imports = this._ast.useStatements
      .map(this._emitUseStatement.bind(this))

    return module +
      '\n\n' + exports +
      '\n\n' + runtimeImports +
      '\n\n' + imports +
      '\n\n' + declarations
  }

  _emitModuleStatement (moduleStatement) {
    if (moduleStatement == null) {
      return `-module(module_${this._filename}).`
    }

    const module = this._emitModuleIdentifier(
      moduleStatement.moduleIdentifier
    )
    const filename = this._filename
    const name = module === ''
      ? filename
      : `${module}_${filename}`

    return `-module(module_${name}).`
  }

  _emitUseStatement (useStatement) {
    const module = this._emitModuleIdentifier(
      useStatement.qualifiedIdentifier.moduleIdentifier
    )
    const type = this._emitSimpleIdentifier(
      useStatement.qualifiedIdentifier.simpleIdentifier
    )

    return `-import(module_${module}, [type_${type}/0]).`
  }

  _emitQualifiedIdentifier (qualifiedIdentifier) {
    const module = this._emitModuleIdentifier(
      qualifiedIdentifier.moduleIdentifier
    )
    const id = this._emitSimpleIdentifier(
      qualifiedIdentifier.simpleIdentifier
    )
    return module === ''
      ? id
      : `${module}_${id}`
  }

  _emitModuleIdentifier (moduleIdentifier) {
    const identifiers = moduleIdentifier
      .simpleIdentifiers
      .map(this._emitSimpleIdentifier.bind(this))
    return identifiers.join('_')
  }

  _emitSimpleIdentifier (simpleIdentifier) {
    return simpleIdentifier.symbol.content
  }

  get _filename () {
    const segments = this._filePath.split(/[\/\\]/)
    const last = segments[segments.length - 1]
    return last.replace(/\.loa$/, '')
  }

  _emitTopLevelDeclaration (topLevel) {
    if (topLevel.declaration instanceof ast.InterfaceDeclaration) {
      return this._emitInterfaceDeclaration(topLevel.declaration, topLevel.visibility)
    }
    if (topLevel.declaration instanceof ast.FunctionDeclaration) {
      return this._emitFunctionDeclaration(topLevel.declaration, topLevel.visibility)
    }
    throw new Error(`Can't emit top level ${topLevel.declaration.constructor}`)
  }

  _emitInterfaceDeclaration (interfaceDeclaration, visibility) {
    this._addRuntimeFunction('type/3')
    const name = interfaceDeclaration.identifier.symbol.content
    const erlName = `type_${name}`

    if (this._isPublic(visibility)) {
      this._exports.push(erlName + '/0')
    }

    const qualifiedName = this._qualifiedName(name)

    return `${erlName}() -> type("${qualifiedName}", [], #{}).`
  }

  _isPublic (visibility) {
    return visibility && visibility.keyword.content === 'public'
  }

  _emitFunctionDeclaration (functionDeclaration, visibility) {
    this._addRuntimeFunction('function/4')
    const name = this._emitSimpleIdentifier(
      functionDeclaration.identifier
    )
    const erlName = `fun_${name}`

    if (this._isPublic(visibility)) {
      this._exports.push(erlName + '/0')
    }

    return erlName +
      '() -> ' +
      this._emitFunctionExpression(functionDeclaration.functionExpression, name) +
      '.'
  }

  _emitFunctionExpression (functionExpression, name = '') {
    const returnType = this._emitTypeArgument(
      functionExpression.returnType.typeArgument
    )
    const body = this._emitFunctionBody(
      functionExpression.body
    )
    return `function("${name}", [], ${returnType}, ${body})`
  }

  _emitTypeArgument (typeArgument) {
    if (typeArgument instanceof ast.TypeReference) {
      return this._emitTypeReference(typeArgument)
    }
    throw new Error(`TODO: Emit type expression ${typeArgument.constructor.name}`)
  }

  _emitTypeReference (typeReference) {
    return `type_${this._emitIdentifier(typeReference.identifier)}()`
  }

  _emitIdentifier (identifier) {
    if (identifier instanceof ast.SimpleIdentifier) {
      return this._emitSimpleIdentifier(identifier)
    }
    if (identifier instanceof ast.QualifiedIdentifier) {
      return this._emitQualifiedIdentifier(identifier)
    }
  }

  _emitFunctionBody (functionBody) {
    const statements = functionBody.statements
      .map(this._emitStatement.bind(this))
    return `fun() -> ${statements.join(', ')} end`
  }

  _emitStatement (statement) {
    if (statement instanceof ast.ReturnStatement) {
      return this._emitReturnStatement(statement)
    }
    throw new Error(`TODO: Emit statement ${statement.constructor.name}`)
  }

  _emitReturnStatement (returnStatement) {
    return this._emitExpression(returnStatement.expression)
  }

  _emitExpression (expression) {
    if (expression instanceof ast.IntegerLiteralExpression) {
      return this._emitIntegerLiteralExpression(expression)
    }
    throw new Error(`TODO: Emit expression ${expression.constructor.name}`)
  }

  _emitIntegerLiteralExpression (expression) {
    this._addRuntimeFunction('literal_Int/1')
    return `literal_Int(${expression.literal.content})`
  }

  _addRuntimeFunction (erlangLoaRuntimeFunction) {
    this._runtimeImports.push(erlangLoaRuntimeFunction)
  }

  _qualifiedName (name) {
    const moduleName = this._moduleName

    if (moduleName === '') {
      return name
    }

    return `${moduleName}.${name}`
  }

  get _moduleName () {
    if (this._ast.moduleStatement == null) {
      return ''
    }

    return this._ast.moduleStatement.moduleIdentifier.identifiers
      .map((i) => i.symbol.content)
      .join('.')
  }
}
