export default class OptimizerError extends Error {
  static WARNING = 'WARNING'
  static ERROR = 'ERROR'
  static HINT = 'HINT'

  constructor (level, filename, code, astNode, message) {
    super(`OptimizerError: ${level}: ${message}, on ${astNode.constructor.name}`)

    this.level = level
    this.filename = filename
    this.code = code
    this.astNode = astNode
    this.raw = message
  }
}
