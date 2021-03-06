/**
 * IfStatement ::=
 *   IF_KEYWORD
 *   Expression
 *   FunctionBody
 */
export default class IfStatement {
  constructor (
    keyword,
    expression,
    body
  ) {
    this.keyword = keyword
    this.expression = expression
    this.body = body
  }

  get begin () {
    return this.keyword
  }

  get end () {
    return this.body.end
  }
}
