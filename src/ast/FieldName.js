/**
 * FieldName ::=
 *   SimpleIdentifier |
 *   OverloadableOperator
 */
export default class FieldName {
  constructor (
    name
  ) {
    this.name = name
  }

  get begin () {
    return this.name.begin
  }

  get end () {
    return this.name.end
  }
}
