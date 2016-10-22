/**
 * ReturnStatement ::=
 *   RETURN_KEYWORD
 *   Expression
 */
export default class ReturnStatement {
  constructor (
    keyword,
    expression
  ) {
    this.keyword = keyword
    this.expression = expression
  }
}
