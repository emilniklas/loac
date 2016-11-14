export default class References {
  constructor (declaration, typeArgument, level, references = []) {
    this.declaration = declaration
    this.typeArgument = typeArgument
    this.level = level
    this.references = references
  }

  addReference (reference) {
    return new References(
      this.declaration,
      this.typeArgument,
      this.level,
      this.references.concat(reference)
    )
  }
}
