import * as ast from '../../../src/ast'
import * as t from '../../../src/tokens'
import { tok, qualifiedIdentifier, symbol } from '../helpers'

export default new ast.Program(
  null,
  [new ast.UseStatement(
    tok(t.USE_KEYWORD, 'use', [1, 0]),
    qualifiedIdentifier(
      symbol('Loa', [1, 4]),
      symbol('Project', [1, 8]),
      symbol('Definition', [1, 16]),
    )
  )]
)
