/**
 * Field ::=
 *   Annotation*
 *   Visibility
 *   (STATIC_KEYWORD | CONST_KEYWORD | DELEGATE_KEYWORD)?
 *   FieldName?
 *   FieldBody?
 */
export default class Field {
  constructor (
    annotations = [],
    visibility,
    keyword = null,
    name = null,
    body = null
  ) {
    this.annotations = annotations
    this.visibility = visibility
    this.keyword = keyword
    this.name = name
    this.body = body
  }

  get begin () {
    return this.annotations.length > 1
      ? this.annotations[0].begin
      : this.visibility.begin
  }

  get end () {
    return (
      this.body ||
      this.name ||
      this.keyword ||
      this.visibility
    ).end
  }
}
