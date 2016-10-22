/**
 * FunctionExpression ::=
 *   ParameterList
 *   ReturnType?
 *   FunctionBody?
 */
export default class FunctionExpression {
  constructor (
    parameterList,
    returnType = null,
    body = null
  ) {
    this.parameterList = parameterList
    this.returnType = returnType
    this.body = body
  }
}
