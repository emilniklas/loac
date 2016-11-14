import TypeReference from '../ast/TypeReference'
import SimpleIdentifier from '../ast/SimpleIdentifier'
import TypeArguments from '../ast/TypeArguments'
import * as ir from '../ir'

export default class ListTypeArgumentOptimization {
  ListTypeArgument (listTypeArgument) {
    const type = listTypeArgument.typeArgument
    return new TypeReference(
      new SimpleIdentifier(ir.symbol('List')),
      new TypeArguments(
        ir.BEGIN_ANGLE_BRACKET,
        [type],
        ir.END_ANGLE_BRACKET
      )
    )
  }
}
