/**
 * FunctionDeclaration ::=
 *   SimpleIdentifier
 *   FunctionExpression
 */
export default class FunctionDeclaration {
  constructor (
    identifier,
    functionExpression,
  ) {
    this.identifier = identifier
    this.functionExpression = functionExpression
  }

  get begin () {
    return this.identifier.begin
  }

  get end () {
    return this.functionExpression.end
  }
}
