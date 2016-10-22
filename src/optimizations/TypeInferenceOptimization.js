import * as ast from '../ast'
import * as ir from '../ir'
import OptimizerError from '../errors/OptimizerError'
import { deepEquals } from '../utils'
import Traverser from '../Traverser'

export default class TypeInferenceOptimization {
  FunctionExpression (functionExpression, symbols) {
    if (functionExpression.returnType != null) {
      return functionExpression
    }

    const returnType = functionExpression.body == null
      ? new ast.TypeReference(
          new ast.SimpleIdentifier(ir.symbol('Any'))
        )
      : this._inferFromFunctionBody(
          functionExpression.body,
          symbols
        )

    return new ast.FunctionExpression(
      functionExpression.parameterList,
      new ast.ReturnType(
        ir.ARROW,
        returnType
      ),
      functionExpression.body
    )
  }

  _inferFromFunctionBody (body, symbols) {
    if (body instanceof ast.BlockFunctionBody) {
      return this._inferFromBlockFunctionBody(body, symbols)
    }
    throw new OptimizerError(
      body, 'Expected a function body'
    )
  }

  _inferFromBlockFunctionBody (body, symbols) {
    const types = this._extractStatements(body)
      .reduce((statements, statement) =>
        statements.concat(this._extractStatements(statement)),
        []
      )
      .filter((statement) =>
        statement instanceof ast.ReturnStatement
      )
      .map((statement) =>
        this._inferFromExpression(statement.expression, symbols)
      )
      .reduce((types, type) =>
        this._containsType(types, type)
          ? types
          : types.concat(type),
        []
      )

    if (types.length === 0) {
      return new ast.TypeReference(
        new ast.SimpleIdentifier(ir.symbol('Unit'))
      )
    }

    if (types.length === 1) {
      return types[0]
    }
    return new ast.UnionTypeArgument(
      types
    )
  }

  _extractStatements (node) {
    if (node instanceof ast.ExpressionFunctionBody) {
      return node.expression
    }

    if (node instanceof ast.BlockFunctionBody) {
      return node.statements
    }

    if (node instanceof ast.IfStatement) {
      return this._extractStatements(node.body)
    }

    return node
  }

  _containsType (types, type) {
    for (let existing of types) {
      if (deepEquals(existing, type)) {
        return true
      }
    }
    return false
  }

  _inferFromExpression (expression, symbols) {
    if (expression instanceof ast.IntegerLiteralExpression) {
      return new ast.TypeReference(
        new ast.SimpleIdentifier(ir.symbol('Int'))
      )
    }

    if (expression instanceof ast.FloatLiteralExpression) {
      return new ast.TypeReference(
        new ast.SimpleIdentifier(ir.symbol('Float'))
      )
    }

    if (expression instanceof ast.ValueExpression) {
      const symbol = expression.symbol.content
      const registry = symbols.get(symbol)
      if (registry != null) {
        return registry.type
      }
    }

    throw new OptimizerError(
      expression, 'Could not infer type'
    )
  }

  LetStatement (statement, symbols) {
    const newSymbols = symbols
      .set(statement.pattern.identifier.symbol.content, {
        type: statement.pattern.typeArgument,
        value: statement.expression
      })
  }
}
