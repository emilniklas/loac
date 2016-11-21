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

  get begin () {
    return this.keyword
  }

  get end () {
    return this.assignment.end
  }
}
