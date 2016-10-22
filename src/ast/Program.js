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
}
