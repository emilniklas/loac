import Optimization from './Optimization'
import * as ast from '../ast'
import { BEGIN_CURLY_BRACE, END_CURLY_BRACE } from '../ir'

export default class AlwaysObjectBodyOptimization {
  ObjectDeclaration (declaration) {
    if (declaration.body != null) {
      return declaration
    }
    return new ast.ObjectDeclaration(
      declaration.identifier,
      declaration.generics,
      declaration.typeArgument,
      new ast.ObjectBody(
        BEGIN_CURLY_BRACE,
        [],
        END_CURLY_BRACE
      )
    )
  }
}
