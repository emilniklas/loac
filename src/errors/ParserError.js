export default class ParserError extends Error {
  constructor (filename, code, tokens, cursor, message) {
    const token = tokens[cursor]
    super(`ParserError: ${message}, saw ${token.type} "${token.content}"`)

    this.token = token
    this.filename = filename
    this.code = code
    this.tokens = tokens
    this.cursor = cursor
    this.raw = message
  }
}
