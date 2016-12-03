/**
 * FunctionTypeArgument ::=
 *   TupleTypeArgument
 *   ReturnType
 */
export default class FunctionTypeArgument {
  constructor (
    parameters,
    returnType
  ) {
    this.parameters = parameters
    this.returnType = returnType
  }

  get begin () {
    return this.parameters.begin
  }

  get end () {
    return this.returnType.end
  }
}
