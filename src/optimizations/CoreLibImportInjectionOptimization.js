import Program from '../ast/Program'
import * as ir from '../ir'

export default class CoreLibImportInjectionOptimization {
  constructor () {
    this._imports = []
  }

  get read () {
    return {
      TypeReference: (reference) => {
        const symbol = reference.identifier.symbol.content
        switch (symbol) {
          case 'Unit':
          case 'Int':
          case 'Bool':
          case 'Float':
          case 'String':
          case 'Char':
          case 'List':
          case 'Dict':
          case 'Future':
          case 'Tuple2':
          case 'Tuple3':
          case 'Tuple4':
          case 'Tuple5':
          case 'Tuple6':
          case 'Tuple7':
          case 'Tuple8':
          case 'Tuple9':
          case 'Tuple10':
          case 'Tuple11':
          case 'Tuple12':
          case 'Tuple13':
          case 'Tuple14':
          case 'Tuple15':
          case 'Tuple16':
          case 'Tuple17':
          case 'Tuple18':
          case 'Tuple19':
          case 'Tuple20':
            this._imports.push(`Loa.Core.${symbol}`)
            break
        }
        return reference
      }
    }
  }

  get write () {
    return {
      Program: (program) => {
        return new Program(
          program.moduleStatement,
          program.useStatements
            .concat(this._useStatements),
          program.topLevelDeclarations
        )
      }
    }
  }

  get _useStatements () {
    return this._imports
      .filter((im, i, a) => a.indexOf(im) === i)
      .map(ir.useStatement)
  }
}
