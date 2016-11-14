import * as ast from '../../../src/ast'
import * as t from '../../../src/tokens'
import {
  tok,
  symbol,
  moduleIdentifier,
  qualifiedIdentifier,
  simpleIdentifier
} from '../helpers'

export default new ast.Program(
  // module Loa.Project
  new ast.ModuleStatement(
    // module
    tok(t.MODULE_KEYWORD, 'module', [1, 0]),

    // Loa.Project
    moduleIdentifier(
      symbol('Loa', [1, 7]),
      symbol('Project', [1, 11])
    )
  ),

  [
    // use Library.One.Class
    new ast.UseStatement(
      // use
      tok(t.USE_KEYWORD, 'use', [3, 0]),

      // Library.One.Class
      qualifiedIdentifier(
        symbol('Library', [3, 4]),
        symbol('One', [3, 12]),
        symbol('Class', [3, 16])
      )
    ),

    // use Library.Two.Struct
    new ast.UseStatement(
      // use
      tok(t.USE_KEYWORD, 'use', [4, 0]),

      // Library.Two.Struct
      qualifiedIdentifier(
        symbol('Library', [4, 4]),
        symbol('Two', [4, 12]),
        symbol('Struct', [4, 16])
      )
    )
  ],

  [
    new ast.TopLevelDeclaration(
      [],
      new ast.Visibility(
        tok(t.PUBLIC_KEYWORD, 'public', [6, 0])
      ),
      new ast.ConstantDeclaration(
        tok(t.CONST_KEYWORD, 'const', [6, 7]),
        new ast.Assignment(
          new ast.TypedPattern(
            new ast.NamePattern(
              simpleIdentifier('someConst', [6, 13])
            ),
            null
          ),
          new ast.IntegerLiteralExpression(
            tok(t.INTEGER_LITERAL, '456', [6, 25])
          )
        )
      )
    )
  ]
)
