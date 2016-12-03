import Optimization from './Optimization'
import ReferenceResolver from '../analysis/ReferenceResolver'
import { PUBLIC_KEYWORD } from '../tokens'

export default class ResolveReferencesOptimization extends Optimization {
  Program (program) {
    const bindings = ReferenceResolver.resolve(program)

    for (const binding of bindings) {
      if (binding.declaration == null) {
        this.error(
          binding.reference, `'${binding.name}' is not defined`
        )
      } else if (binding.reference == null && !this._isPublic(binding.visibility)) {
        this.warning(
          binding.declaration, `'${binding.name}' is never used`
        )
      }
    }

    return program
  }

  _isPublic (visibility) {
    return visibility != null &&
      visibility.keyword.type === PUBLIC_KEYWORD
  }
}
