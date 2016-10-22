import TypeReference from '../ast/TypeReference'
import SimpleIdentifier from '../ast/SimpleIdentifier'
import TypeArguments from '../ast/TypeArguments'
import * as ir from '../ir'

export default class TupleTypeArgumentOptimization {
  TupleTypeArgument (tupleTypeArgument) {
    // An zero element tuple is a Unit
    if (tupleTypeArgument.typeArguments.length === 0) {
      return new TypeReference(
        new SimpleIdentifier(ir.symbol('Unit'))
      )
    }

    // A single element tuple is equivalent with that type
    if (tupleTypeArgument.typeArguments.length === 1) {
      return tupleTypeArgument.typeArguments[0]
    }

    // Tuples with more tha one element is transformed to
    // TupleN<T1, T2, ... TN>
    return new TypeReference(
      new SimpleIdentifier(
        ir.symbol(`Tuple${tupleTypeArgument.typeArguments.length}`)
      ),
      new TypeArguments(
        ir.BEGIN_ANGLE_BRACKET,
        tupleTypeArgument.typeArguments,
        ir.END_ANGLE_BRACKET
      )
    )
  }
}
