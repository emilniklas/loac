import TypeReference from '../ast/TypeReference'
import SimpleIdentifier from '../ast/SimpleIdentifier'
import TypeArguments from '../ast/TypeArguments'
import * as ir from '../ir'

export default class DictTypeArgumentOptimization {
  DictTypeArgument (dictTypeArgument) {
    return new TypeReference(
      new SimpleIdentifier(ir.symbol('Dict')),
      new TypeArguments(
        ir.BEGIN_ANGLE_BRACKET,
        [
          dictTypeArgument.keyTypeArgument,
          dictTypeArgument.valueTypeArgument
        ],
        ir.END_ANGLE_BRACKET
      )
    )
  }
}
