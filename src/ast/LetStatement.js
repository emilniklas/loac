/**
 * LetStatement ::=
 *   LET_KEYWORD
 *   TypedPattern
 *   ASSIGN_OPERATOR
 *   Expression
 */
export default class LetStatement {
  constructor (
    keyword,
    pattern,
    operator,
    expression
  ) {
    this.keyword = keyword
    this.pattern = pattern
    this.operator = operator
    this.expression = expression
  }
}
