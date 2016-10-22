import * as ast from '../../../src/ast'
import * as t from '../../../src/tokens'
import { symbol, tok } from '../helpers'

export default new ast.Program(
  new ast.ModuleStatement(
    tok(t.MODULE_KEYWORD, 'module', [1, 0]),
    new ast.ModuleIdentifier([
      new ast.SimpleIdentifier(
        symbol('Loa', [1, 7])
      ),
      new ast.SimpleIdentifier(
        symbol('Project', [1, 11])
      )
    ])
  )
)
