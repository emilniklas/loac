export default class OptimizerError extends Error {
  constructor (astNode, message) {
    super(`OptimizerError: ${message}, on ${astNode.constructor.name}`)
    this.astNode = astNode
  }
}
