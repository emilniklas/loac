/**
 * UseStatement ::=
 *   USE_KEYWORD
 *   QualifiedIdentifier
 */
export default class UseStatement {
  constructor (
    useKeyword,
    qualifiedIdentifier
  ) {
    this.useKeyword = useKeyword
    this.qualifiedIdentifier = qualifiedIdentifier
  }
}
