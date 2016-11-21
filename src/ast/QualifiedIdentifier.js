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

  get begin () {
    return this.moduleIdentifier.begin
  }

  get end () {
    return this.simpleIdentifier.end
  }
}
