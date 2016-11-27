import ListTypeArgumentOptimization from './optimizations/ListTypeArgumentOptimization'
import DictTypeArgumentOptimization from './optimizations/DictTypeArgumentOptimization'
import TupleTypeArgumentOptimization from './optimizations/TupleTypeArgumentOptimization'
import FutureTypeArgumentOptimization from './optimizations/FutureTypeArgumentOptimization'
import ExpressionFunctionBodyOptimization from './optimizations/ExpressionFunctionBodyOptimization'
import TypeInferenceOptimization from './optimizations/TypeInferenceOptimization'
import CoreLibImportInjectionOptimization from './optimizations/CoreLibImportInjectionOptimization'
import AlwaysReturnOptimization from './optimizations/AlwaysReturnOptimization'
import ResolveReferencesOptimization from './optimizations/ResolveReferencesOptimization'
import MoveInlineQualifiedIdentifiersToUseStatementsOptimization from
  './optimizations/MoveInlineQualifiedIdentifiersToUseStatementsOptimization'

import Traverser from './Traverser'
import MessageAggregator from './MessageAggregator'

export default class Optimizer {
  constructor (ast, messages) {
    this.ast = ast
    this._messages = messages
  }

  static optimize (filename, code, ast, messages = new MessageAggregator()) {
    const coreLibImportInjectionOptimization =
      new CoreLibImportInjectionOptimization(filename, code, messages)

    const typeInferenceOptimization =
      new TypeInferenceOptimization(filename, code, messages)

    const moveInlineQualifiedIdentifiersToUseStatementsOptimization =
      new MoveInlineQualifiedIdentifiersToUseStatementsOptimization(filename, code, messages)

    return new Optimizer(ast, messages)
      .apply(new ExpressionFunctionBodyOptimization(filename, code, messages))
      .apply(new AlwaysReturnOptimization(filename, code, messages))
      .apply(new ListTypeArgumentOptimization(filename, code, messages))
      .apply(new DictTypeArgumentOptimization(filename, code, messages))
      .apply(new TupleTypeArgumentOptimization(filename, code, messages))
      .apply(new FutureTypeArgumentOptimization(filename, code, messages))
      .apply(moveInlineQualifiedIdentifiersToUseStatementsOptimization.collect)
      .apply(moveInlineQualifiedIdentifiersToUseStatementsOptimization.splice)
      .apply(typeInferenceOptimization.bindings)
      .apply(typeInferenceOptimization.values)
      .apply(typeInferenceOptimization.functions)
      .apply(coreLibImportInjectionOptimization.read)
      .apply(coreLibImportInjectionOptimization.write)
      .apply(new ResolveReferencesOptimization(filename, code, messages))
      .ast
  }

  apply (optimization) {
    const methods = optimization.constructor === Object
      ? Reflect.ownKeys(optimization)
      : Reflect.ownKeys(Reflect.getPrototypeOf(optimization))
    const ast = Traverser.traverse(this.ast, (node) => {
      for (let method of methods) {
        if (node.constructor.name === method) {
          return optimization[method](node)
        }
      }
      return node
    })

    return new Optimizer(ast, this._messages)
  }
}
