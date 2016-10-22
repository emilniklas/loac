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
    new ast.FunctionDeclaration(
      simpleIdentifier('f', [1, 7]),
      new ast.FunctionExpression(
        new ast.ParameterList(
          tok(t.BEGIN_PAREN, '(', [1, 9]),
          [],
          tok(t.END_PAREN, ')', [1, 10])
        ),
        new ast.ReturnType(
          tok(t.ARROW, '->', [1, 12]),
          new ast.TypeReference(
            simpleIdentifier('T', [1, 15])
          )
        ),
        new ast.BlockFunctionBody(
          tok(t.BEGIN_CURLY_BRACE, '{', [1, 17]),
          [],
          tok(t.END_CURLY_BRACE, '}', [1, 18])
        )
      )
    )
  )
])
