import Optimization from './Optimization'
import ReferenceResolver from '../analysis/ReferenceResolver'

export default class ResolveReferencesOptimization extends Optimization {
  Program (program) {
    const allReferences = ReferenceResolver.resolve(program)

    for (const references of allReferences) {
      if (references.declaration == null) {
        for (const reference of references.references) {
          this.error(
            reference, `'${reference.identifier.symbol.content}' is not defined`
          )
        }
      }
    }

    return program
  }
}
