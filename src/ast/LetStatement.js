/**
 * LetStatement ::=
 *   LET_KEYWORD
 *   ( Assignment
 *   | FunctionDeclaration
 *   )
 */
export default class LetStatement {
  constructor (
    keyword,
    declaration
  ) {
    this.keyword = keyword
    this.declaration = declaration
  }
}
