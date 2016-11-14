/**
 * Assignment ::=
 *   TypedPattern
 *   (
 *     ASSIGN_OPERATOR
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
}
