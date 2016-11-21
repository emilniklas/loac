/**
 * Assignment ::=
 *   TypedPattern
 *   (
 *     EQUALS_SIGN
 *     Expression
 *   )?
 */
export default class Assignment {
  constructor (
    pattern,
    expression = null
  ) {
    this.pattern = pattern
    this.expression = expression
  }

  get begin () {
    return this.pattern.begin
  }

  get end () {
    return this.expression == null
      ? this.pattern.end
      : this.expression.end
  }
}
