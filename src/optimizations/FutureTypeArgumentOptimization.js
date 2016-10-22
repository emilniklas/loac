import TypeReference from '../ast/TypeReference'
import SimpleIdentifier from '../ast/SimpleIdentifier'
import TypeArguments from '../ast/TypeArguments'
import * as ir from '../ir'

export default class FutureTypeArgumentOptimization {
  FutureTypeArgument (futureTypeArgument) {
    return new TypeReference(
      new SimpleIdentifier(ir.symbol('Future')),
      new TypeArguments(
        ir.BEGIN_ANGLE_BRACKET,
        [futureTypeArgument.typeArgument],
        ir.END_ANGLE_BRACKET
      )
    )
  }
}
