/**
 * BlockFunctionBody ::=
 *   BEGIN_CURLY_BRACE
 *   Statement*
 *   END_CURLY_BRACE
 */
export default class BlockFunctionBody {
  constructor (
    beginCurly,
    statements,
    closeCurly
  ) {
    this.beginCurly = beginCurly
    this.statements = statements
    this.closeCurly = closeCurly
  }

  get begin () {
    return this.beginCurly
  }

  get end () {
    return this.endCurly
  }
}
