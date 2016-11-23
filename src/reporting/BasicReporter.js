import SyntaxError from '../errors/SyntaxError'
import ParserError from '../errors/ParserError'
import OptimizerError from '../errors/OptimizerError'

export default class BasicReporter {
  constructor (messages) {
    this.messages = messages

    this._reportMessage = this._reportMessage.bind(this)
  }

  static report (messages) {
    return new this(messages).report()
  }

  report () {
    return this.messages.map(this._reportMessage)
  }

  _reportMessage (message) {
    switch (message.constructor) {
      case SyntaxError:
        return this._createBasicReport({
          filename: message.filename,
          location: this._locationFromCodeAndCursor(
            message.code,
            message.cursor
          ),
          level: 'error',
          message: message.raw
        })

      case ParserError:
        return this._createBasicReport({
          filename: message.filename,
          location: this._locationFromTokenLocation(
            message.token.location
          ),
          level: 'error',
          message: message.raw
        })

      case OptimizerError:
        return this._createBasicReport({
          filename: message.filename,
          location: this._locationFromTokenLocation(
            message.astNode.begin.location
          ),
          level: message.level.toLowerCase(),
          message: message.raw
        })

      default:
        return message.stack
    }
  }

  _locationFromTokenLocation (location) {
    if (location == null) {
      return [NaN, NaN]
    }
    return location.slice(1)
  }

  _locationFromCodeAndCursor (code, cursor) {
    const lines = code.substr(0, cursor).split('\n')
    return [
      lines.length,
      lines[lines.length - 1].length
    ]
  }

  _createBasicReport ({ filename, location, level, message }) {
    const [ line, column ] = location
    return `${filename}:${line}:${column}: ${level}: ${message}`
  }
}
