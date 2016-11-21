export default class SyntaxError extends Error {
  constructor (filename, code, cursor, message) {
    super(`SyntaxError: ${message}: ${code.substr(cursor).split(/\s+/)[0]}`)

    this.filename = filename
    this.code = code
    this.cursor = cursor
    this.raw = message
  }
}
