import SymbolTable from './analysis/SymbolTable'

export default class Traverser {
  constructor (ast, transform, symbols) {
    this.ast = ast
    this.transform = transform
    this.symbols = symbols
  }

  static traverse (ast, transform, symbols) {
    return new Traverser(
      ast, transform, symbols || SymbolTable.make()
    )._traverseRoot()
  }

  _traverseRoot () {
    return this._traverse(this.ast, this.symbols)
  }

  _traverseChildren () {
    const copy = Object.create(this.ast.constructor.prototype)

    for (let field in this.ast) {
      if (!this.ast.hasOwnProperty(field)) {
        continue
      }

      const current = this.ast[field]

      if (
        typeof current !== 'object' ||
        current == null ||
        current.constructor === Object
      ) {
        copy[field] = current
        continue
      }

      if (Array.isArray(current)) {
        copy[field] = this._traverseMultiple(current)
        continue
      }

      copy[field] = this._traverse(current, this.symbols)
    }

    return copy
  }

  _traverse (node, symbols) {
    const [ast, newSymbols] = this._transform(node, symbols)

    return this._nest(ast, newSymbols)
  }

  _nest (ast, symbols) {
    return new Traverser(ast, this.transform, symbols)
      ._traverseChildren()
  }

  _transform (node, symbols) {
    const result = this.transform(node, symbols)
    return Array.isArray(result)
      ? result
      : [result, symbols]
  }

  _traverseMultiple (nodes) {
    const [newNodes] = nodes.reduce(
      ([nodes, symbols], node) => {
        const [newNode, newSymbols] = this._transform(node, symbols)
        return [nodes.concat(this._nest(newNode, newSymbols)), newSymbols]
      },
      [[], this.symbols]
    )
    return newNodes
  }
}
