/**
 * ModuleIdentifier ::=
 *  SimpleIdentifier
 *  (SimpleIdentifier PERIOD)*
 */
export default class ModuleIdentifer {
  constructor (
    simpleIdentifiers
  ) {
    this.simpleIdentifiers = simpleIdentifiers
  }

  get begin () {
    return this.simpleIdentifiers[0].begin
  }

  get end () {
    return this.simpleIdentifiers[this.simpleIdentifiers.length - 1].end
  }
}
