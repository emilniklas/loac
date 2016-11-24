export default class Traverser {
  constructor (ast, transform) {
    this.ast = ast
    this.transform = transform
  }

  static traverse (ast, transform) {
    return new Traverser(
      ast, transform
    )._traverseRoot()
  }

  _traverseRoot () {
    return this._traverse(this.ast)
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

      copy[field] = this._traverse(current)
    }

    return copy
  }

  _traverse (node) {
    const ast = this.transform(node)

    return this._nest(ast)
  }

  _nest (ast) {
    return new Traverser(ast, this.transform)
      ._traverseChildren()
  }

  _traverseMultiple (nodes) {
    return nodes.map((node) => this._nest(this.transform(node)))
  }
}
