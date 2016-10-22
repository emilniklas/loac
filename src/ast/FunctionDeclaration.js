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
}
