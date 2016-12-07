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
    new ast.InterfaceDeclaration(
      tok(t.INTERFACE_KEYWORD, 'interface', [1, 7]),
      new ast.ObjectDeclaration(
        simpleIdentifier('Y', [1, 17]),
        null,
        null,
        new ast.ObjectBody(
          tok(t.BEGIN_CURLY_BRACE, '{', [1, 19]),
          [
            new ast.Field(
              [],
              new ast.Visibility(
                tok(t.PUBLIC_KEYWORD, 'public', [2, 2])
              ),
              null,
              new ast.FieldName(
                simpleIdentifier('field', [2, 9])
              )
            )
          ],
          tok(t.END_CURLY_BRACE, '}', [3, 0])
        )
      )
    )
  )
])
