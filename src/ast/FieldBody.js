/**
 * FieldBody ::=
 *   TypeAnnotation? (EQUALS_SIGN Expression | FunctionBody)? |
 *   FunctionExpression
 */
export default class FieldBody {
  constructor (
    typeAnnotation = null,
    computeBody = null,
    expression = null
  ) {
    this.typeAnnotation = typeAnnotation
    this.computeBody = computeBody
    this.expression = expression
  }

  get begin () {
    return (this.typeAnnotation || this.expression || this.computeBody).begin
  }

  get end () {
    return (this.expression || this.typeAnnotation || this.computeBody).end
  }
}
