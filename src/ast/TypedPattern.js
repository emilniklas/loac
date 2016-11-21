/**
 * TypedPattern ::=
 *   Pattern
 *   (COLON TypeArgument)?
 */
export default class TypedPattern {
  constructor (
    pattern,
    typeArgument = null
  ) {
    this.pattern = pattern
    this.typeArgument = typeArgument
  }

  get begin () {
    return this.pattern.begin
  }

  get end () {
    return (this.typeArgument || this.pattern).end
  }
}
