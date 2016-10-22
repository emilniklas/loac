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
}
