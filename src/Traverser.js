export default class Traverser {
  constructor (ast, enter, exit) {
    this.ast = ast
    this.enter = enter || ((n) => n)
    this.exit = exit || ((n) => n)
  }

  static traverse (ast, enter, exit) {
    return new Traverser(
      ast, enter, exit
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
    return this.exit(this._nest(this.enter(node)))
  }

  _nest (ast) {
    return new Traverser(ast, this.enter, this.exit)
      ._traverseChildren()
  }

  _traverseMultiple (nodes) {
    return nodes.map((node) => this._traverse((node)))
  }
}
