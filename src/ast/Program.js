/**
 * Program ::=
 *   ModuleStatement?
 *   UseStatement*
 *   TopLevelDeclaration*
 */
export default class Program {
  constructor (
    moduleStatement = null,
    useStatements = [],
    topLevelDeclarations = []
  ) {
    this.moduleStatement = moduleStatement
    this.useStatements = useStatements
    this.topLevelDeclarations = topLevelDeclarations
  }

  get begin () {
    return (
      this.moduleStatement ||
      this.useStatements[0] ||
      this.topLevelDeclarations[0] ||
      { begin: null }
    ).begin
  }

  get end () {
    return (
      this.topLevelDeclarations[this.topLevelDeclarations.length - 1] ||
      this.useStatements[this.useStatements.length - 1] ||
      this.moduleStatement ||
      { end: null }
    ).end
  }
}
