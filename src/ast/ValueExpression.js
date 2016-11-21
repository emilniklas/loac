/**
 * ValueExpression ::=
 *   SimpleIdentifier
 */
export default class ValueExpression {
  constructor (
    identifier
  ) {
    this.identifier = identifier
  }

  get begin () {
    return this.identifier.begin
  }

  get end () {
    return this.identifier.end
  }
}
