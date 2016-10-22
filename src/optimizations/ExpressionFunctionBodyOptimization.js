import * as ast from '../ast'
import * as ir from '../ir'

export default class ExpressionFunctionBodyOptimization {
  ExpressionFunctionBody (body) {
    return new ast.BlockFunctionBody(
      ir.BEGIN_CURLY_BRACE,
      [new ast.ReturnStatement(
        ir.RETURN_KEYWORD,
        body.expression
      )],
      ir.END_CURLY_BRACE
    )
  }
}
