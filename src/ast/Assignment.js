/**
 * Assignment ::=
 *   Pattern
 *   TypeAnnotation?
 *   (
 *     ASSIGN_OPERATOR
 *     Expression
 *   )?
 */
export default class Assignment {
  constructor (
    pattern,
    typeAnnotation = null,
    expression = null
  ) {
    this.pattern = pattern
    this.typeAnnotation = typeAnnotation
    this.expression = expression
  }
}
