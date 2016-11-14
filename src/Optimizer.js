import ListTypeArgumentOptimization from './optimizations/ListTypeArgumentOptimization'
import DictTypeArgumentOptimization from './optimizations/DictTypeArgumentOptimization'
import TupleTypeArgumentOptimization from './optimizations/TupleTypeArgumentOptimization'
import FutureTypeArgumentOptimization from './optimizations/FutureTypeArgumentOptimization'
import ExpressionFunctionBodyOptimization from './optimizations/ExpressionFunctionBodyOptimization'
import TypeInferenceOptimization from './optimizations/TypeInferenceOptimization'
import CoreLibImportInjectionOptimization from './optimizations/CoreLibImportInjectionOptimization'
import Traverser from './Traverser'

export default class Optimizer {
  constructor (ast) {
    this.ast = ast
  }

  static optimize (ast) {
    const coreLibImportInjectionOptimization =
      new CoreLibImportInjectionOptimization()
    return new Optimizer(ast)
      .apply(new ListTypeArgumentOptimization())
      .apply(new DictTypeArgumentOptimization())
      .apply(new TupleTypeArgumentOptimization())
      .apply(new FutureTypeArgumentOptimization())
      .apply(new ExpressionFunctionBodyOptimization())
      .apply(new TypeInferenceOptimization())
      .apply(coreLibImportInjectionOptimization.read)
      .apply(coreLibImportInjectionOptimization.write)
      .ast
  }

  apply (optimization) {
    const methods = optimization.constructor === Object
      ? Reflect.ownKeys(optimization)
      : Reflect.ownKeys(Reflect.getPrototypeOf(optimization))
    const ast = Traverser.traverse(this.ast, (node, symbols) => {
      for (let method of methods) {
        if (node.constructor.name === method) {
          return optimization[method](node, symbols)
        }
      }
      return node
    })

    return new Optimizer(ast)
  }
}
