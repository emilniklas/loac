/**
 * QualifiedIdentifier ::=
 *   ModuleIdentifier
 *   PERIOD
 *   SimpleIdentifier
 */
export default class QualifiedIdentifer {
  constructor (
    moduleIdentifier,
    simpleIdentifier
  ) {
    this.moduleIdentifier = moduleIdentifier
    this.simpleIdentifier = simpleIdentifier
  }
}
