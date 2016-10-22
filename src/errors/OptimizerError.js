export default class OptimizerError extends Error {
  constructor (astNode, message) {
    super(`${message}, on ${astNode.constructor.name}`)
    this.astNode = astNode
  }
}
