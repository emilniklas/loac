/**
 * ThisExpression ::=
 *   THIS_KEYWORD
 */
export default class ThisExpression {
  constructor (
    keyword
  ) {
    this.keyword = keyword
  }

  get begin () {
    return this.keyword
  }

  get end () {
    return this.keyword
  }
}
