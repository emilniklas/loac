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
}
