import * as ast from '../ast'
import * as ir from '../ir'

export default class MoveInlineQualifiedIdentifiersToUserStatementsOptimization {
  constructor () {
    this._inlineQualifiedIdentifiers = []

    this._useStatement = this._useStatement.bind(this)
  }

  get collect () {
    return {
      TypeReference: (reference) => {
        if (reference.identifier instanceof ast.QualifiedIdentifier) {
          this._inlineQualifiedIdentifiers.push(reference.identifier)

          return new ast.TypeReference(
            reference.identifier.simpleIdentifier,
            reference.typeArguments
          )
        }
        return reference
      }
    }
  }

  get splice () {
    return {
      Program: (program) => {
        return new ast.Program(
          program.moduleStatement,
          program.useStatements.concat(
            this._useStatements
          ),
          program.topLevelDeclarations
        )
      }
    }
  }

  get _useStatements () {
    return this._inlineQualifiedIdentifiers
      .map(this._useStatement)
  }

  _useStatement (qualifiedIdentifier) {
    return new ast.UseStatement(
      ir.USE_KEYWORD,
      qualifiedIdentifier
    )
  }
}
