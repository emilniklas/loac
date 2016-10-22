/**
 * ObjectBody ::=
 *   BEGIN_CURLY_BRACE
 *   Field*
 *   END_CURLY_BRACE
 */
export default class ObjectBody {
  constructor (
    beginCurly,
    fields = [],
    endCurly
  ) {
    this.beginCurly = beginCurly
    this.fields = fields
    this.endCurly = endCurly
  }
}
