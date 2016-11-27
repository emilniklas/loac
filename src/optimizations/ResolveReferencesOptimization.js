import Optimization from './Optimization'
import ReferenceResolver from '../analysis/ReferenceResolver'

export default class ResolveReferencesOptimization extends Optimization {
  Program (program) {
    const bindings = ReferenceResolver.resolve(program)

    for (const binding of bindings) {
      if (binding.declaration == null) {
        this.error(
          binding.reference, `'${binding.name}' is not defined`
        )
      } else if (binding.reference == null) {
        this.warning(
          binding.declaration, `'${binding.name}' is never used`
        )
      }
    }

    return program
  }
}
