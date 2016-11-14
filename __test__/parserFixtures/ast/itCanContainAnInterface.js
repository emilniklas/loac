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
      tok(t.PRIVATE_KEYWORD, 'private', [1, 0])
    ),
    new ast.InterfaceDeclaration(
      tok(t.INTERFACE_KEYWORD, 'interface', [1, 8]),
      simpleIdentifier('X', [1, 18]),
      null,
      null
    )
  )
])
