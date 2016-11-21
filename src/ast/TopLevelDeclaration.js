/**
 * TopLevelDeclaration ::=
 *   Annotation*
 *   Visibility
 *   ( StructDeclaration
 *   | ClassDeclaration
 *   | ActorDeclaration
 *   | FunctionDeclaration
 *   | ConstantDeclaration
 *   )
 */
export default class TopLevelDeclaration {
  constructor (
    annotations = [],
    visibility,
    declaration
  ) {
    this.annotations = annotations
    this.visibility = visibility
    this.declaration = declaration
  }

  get begin () {
    return (this.annotations[0] || this.visibility).begin
  }

  get end () {
    return this.declaration.end
  }
}
