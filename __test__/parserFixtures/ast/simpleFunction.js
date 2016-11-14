import * as ast from '../../../src/ast'
import * as t from '../../../src/tokens'
import {
  tok,
  simpleIdentifier
} from '../helpers'

export default new ast.Program(null, [], [
  new ast.TopLevelDeclaration(
    [],
    new ast.Visibility(
      tok(t.PUBLIC_KEYWORD, 'public', [1, 0])
    ),
    new ast.FunctionDeclaration(
      simpleIdentifier('f', [1, 7]),
      new ast.FunctionExpression(
        new ast.ParameterList(
          tok(t.BEGIN_PAREN, '(', [1, 9]),
          [],
          tok(t.END_PAREN, ')', [1, 10])
        ),
        null,
        new ast.ExpressionFunctionBody(
          tok(t.FAT_ARROW, '=>', [1, 12]),
          new ast.IntegerLiteralExpression(
            tok(t.INTEGER_LITERAL, '123', [1, 15])
          )
        )
      )
    )
  )
])
