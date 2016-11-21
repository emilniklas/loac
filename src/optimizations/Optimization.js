import OptimizerError from '../errors/OptimizerError'

export default class Optimization {
  constructor (filename, code, messages) {
    this.filename = filename
    this.code = code
    this.messages = messages
  }

  _message (level, astNode, message) {
    this.messages.add(
      new OptimizerError(
        level,
        this.filename,
        this.code,
        astNode,
        message
      )
    )
  }

  error (astNode, message) {
    this._message(OptimizerError.ERROR, astNode, message)
  }

  warning (astNode, message) {
    this._message(OptimizerError.WARNING, astNode, message)
  }

  hint (astNode, message) {
    this._message(OptimizerError.HINT, astNode, message)
  }
}
