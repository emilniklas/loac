/**
 * Annotation ::=
 *   AT
 *   Expression
 */
export default class Annotation {
  constructor (
    at,
    annotation
  ) {
    this.at = at
    this.annotation = annotation
  }

  get begin () {
    return this.at
  }

  get end () {
    return this.expression.end
  }
}
