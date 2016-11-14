export default class SyntaxError extends Error {
  constructor (code, cursor, message) {
    super(`SyntaxError: ${message}: ${code.substr(cursor).split(/\s+/)[0]}`)
    this.code = code
    this.cursor = cursor
  }
}
