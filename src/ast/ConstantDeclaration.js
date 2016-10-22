/**
 * ConstantDeclaration ::=
 *   CONST_KEYWORD
 *   Assignment
 */
export default class ConstantDeclaration {
  constructor (
    keyword,
    assignment
  ) {
    this.keyword = keyword
    this.assignment = assignment
  }
}
