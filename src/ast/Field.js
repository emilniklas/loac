/**
 * Field ::=
 *   Annotation*
 *   Visibility?
 *   (DELEGATE_KEYWORD | STATIC_KEYWORD | CONST_KEYWORD)?
 *   SimpleIdentifier
 *   TypeAnnotation?
 *   (EQUALS_SIGN Expression)?
 */
export default class Field {
  constructor (
    annotations = [],
    visibility = null,
    keyword = null,
    identifier,
    typeAnnotation = null,
    expression = null
  ) {
    this.annotations = annotations
    this.visibility = visibility
    this.keyword = keyword
    this.identifier = identifier
    this.typeAnnotation = typeAnnotation
    this.expression = expression
  }
}
