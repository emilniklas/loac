export default class ParserError extends Error {
  constructor (tokens, cursor, message) {
    const token = tokens[cursor]
    super(`ParserError: ${message}, saw ${token.type} "${token.content}"`)
    this.tokens = tokens
    this.cursor = cursor
  }
}
