/**
 * ReturnType ::=
 *   ARROW
 *   TypeArgument
 */
export default class ReturnType {
  constructor (
    arrow,
    typeArgument
  ) {
    this.arrow = arrow
    this.typeArgument = typeArgument
  }

  get begin () {
    return this.arrow
  }

  get end () {
    return this.typeArgument.end
  }
}
