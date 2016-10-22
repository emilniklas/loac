import * as ast from '../../../src/ast'
import * as t from '../../../src/tokens'
import {
  tok,
  symbol,
  moduleIdentifier,
  qualifiedIdentifier,
  simpleIdentifier
} from '../helpers'

export default new ast.Program(null, [], [
  new ast.TopLevelDeclaration(
    [],
    new ast.Visibility(
      tok(t.PUBLIC_KEYWORD, 'public', [1, 0])
    ),
    new ast.ConstantDeclaration(
      tok(t.CONST_KEYWORD, 'const', [1, 7]),
      new ast.Assignment(
        new ast.NamePattern(
          simpleIdentifier('constantOne', [1, 13])
        ),
        null,
        new ast.IntegerLiteralExpression(
          tok(t.INTEGER_LITERAL, '1', [1, 27])
        )
      )
    )
  ),
  new ast.TopLevelDeclaration(
    [],
    new ast.Visibility(
      tok(t.PUBLIC_KEYWORD, 'public', [2, 0])
    ),
    new ast.ConstantDeclaration(
      tok(t.CONST_KEYWORD, 'const', [2, 7]),
      new ast.Assignment(
        new ast.NamePattern(
          simpleIdentifier('constantTwo', [2, 13])
        ),
        null,
        new ast.IntegerLiteralExpression(
          tok(t.INTEGER_LITERAL, '2', [2, 27])
        )
      )
    )
  )
])
