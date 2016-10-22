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
}
