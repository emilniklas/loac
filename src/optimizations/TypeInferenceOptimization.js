import * as ast from '../ast'
import * as ir from '../ir'
import { deepEquals } from '../utils'
import Optimization from './Optimization'
import ReferenceResolver from '../analysis/ReferenceResolver'

export default class TypeInferenceOptimization extends Optimization {
  get bindings () {
    return {
      Program: (program) => {
        this._referenceBindings = ReferenceResolver.resolve(program)

        return program
      }
    }
  }

  get values () {
    return {
      TypedPattern: (typedPattern) => {
        for (const binding of this._referenceBindings) {
          if (this._sameNode(binding.declaration, typedPattern.pattern)) {
            return new ast.TypedPattern(
              typedPattern.pattern,
              binding.type
            )
          }
        }
        return typedPattern
      }
    }
  }

  get functions () {
    return {
      FunctionExpression: (functionExpression) => {
        if (functionExpression.returnType != null) {
          return functionExpression
        }
        return new ast.FunctionExpression(
          functionExpression.parameterList,
          new ast.ReturnType(
            ir.ARROW,
            this._inferFromFunctionBody(functionExpression.body),
          ),
          functionExpression.body
        )
      }
    }
  }

  _sameNode (a, b) {
    const sameLocation =
      a.begin.location[0] === b.begin.location[0] &&
      a.begin.location[1] === b.begin.location[1] &&
      a.begin.location[2] === b.begin.location[2]

    return a.constructor === b.constructor &&
      sameLocation
  }

  _inferFromFunctionBody (body) {
    const returns = this._flattenStatements(
        body.statements
      )
      .filter((st) =>
        st instanceof ast.ReturnStatement
      )
      .map((ret) =>
        this._inferFromExpression(ret.expression)
      )
      .reduce((types, type) =>
        this._containsType(types, type)
          ? types
          : types.concat(type),
        []
      )

    if (returns.length === 0) {
      return ir.typeReference('Unit')
    }

    if (returns.length === 1) {
      return returns[0]
    }

    return new ast.UnionTypeArgument(
      returns
    )
  }

  _containsType (types, type) {
    for (const existing of types) {
      if (deepEquals(existing, type)) {
        return true
      }
    }
    return false
  }

  _flattenStatements (statements) {
    return statements.reduce(
      (statements, statement) => {
        switch (statement.constructor) {
          case ast.IfStatement:
            return statements.concat(statement.body.statements)
          default:
            return statements.concat(statement)
        }
      },
      []
    )
  }

  _inferFromExpression (expression) {
    switch (expression && expression.constructor) {
      case ast.IntegerLiteralExpression:
        return ir.typeReference('Int')
      case ast.FloatLiteralExpression:
        return ir.typeReference('Float')
      case ast.TupleLiteralExpression:
        const length = expression.expressions.length
        if (length === 0) {
          return ir.typeReference('Unit')
        }
        return ir.typeReference(`Tuple${length}`)
      case ast.ValueExpression:
        for (const binding of this._referenceBindings) {
          if (this._sameNode(binding.reference, expression)) {
            return binding.type || ir.typeReference('Any')
          }
        }
      default:
        return ir.typeReference('Any')
    }
  }
}
