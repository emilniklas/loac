/**
 * ModuleStatement ::=
 *   MODULE_KEYWORD
 *   ModuleIdentifier
 */
export default class ModuleStatement {
  constructor (
    moduleKeyword,
    moduleIdentifier
  ) {
    this.moduleKeyword = moduleKeyword
    this.moduleIdentifier = moduleIdentifier
  }
}
