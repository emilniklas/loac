import CodePathTracer from '../analysis/CodePathTracer'
import * as ast from '../ast'
import * as ir from '../ir'

export default class AlwaysReturnOptimization {
  BlockFunctionBody (body) {
    const codePaths = CodePathTracer.trace(body.statements)
    const codePathsWithoutReturn = codePaths
      .filter(this._doesNotContainReturnStatement)

    if (codePathsWithoutReturn.length === 0) {
      return body
    }

    return new ast.BlockFunctionBody(
      body.beginCurly,
      body.statements
        .concat(ir.returnStatement(ir.unitExpression)),
      body.closeCurly
    )
  }
}
