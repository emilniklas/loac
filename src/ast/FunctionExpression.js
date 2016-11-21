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

  get begin () {
    return this.parameterList.begin
  }

  get end () {
    return (this.body || this.returnType || this.parameterList).end
  }
}
