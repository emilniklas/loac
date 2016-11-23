import Optimization from './Optimization'
import ReferenceResolver from '../analysis/ReferenceResolver'

export default class ResolveReferencesOptimization extends Optimization {
  Program (program) {
    const bindings = ReferenceResolver.resolve(program)

    for (const binding of bindings) {
      if (binding.declaration == null) {
        this.error(
          binding.reference, `'${binding.reference.identifier.symbol.content}' is not defined`
        )
      }
    }

    return program
  }
}
