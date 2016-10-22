import * as ast from '../../../src/ast'
import * as t from '../../../src/tokens'
import { tok, simpleIdentifier } from '../helpers'

export default new ast.Program(
  null,
  [],
  [new ast.TopLevelDeclaration(
    [],
    new ast.Visibility(
      tok(t.PUBLIC_KEYWORD, 'public', [1, 0])
    ),
    new ast.ConstantDeclaration(
      tok(t.CONST_KEYWORD, 'const', [1, 7]),
      new ast.Assignment(
        new ast.NamePattern(
          simpleIdentifier('myConstant', [1, 13]),
        ),
        null,
        new ast.IntegerLiteralExpression(
          tok(t.INTEGER_LITERAL, '123', [1, 26])
        )
      )
    )
  )]
)
