/**
 * NamePattern ::=
 *   SimpleIdentifier
 */
export default class NamePattern {
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
