export default class References {
  constructor (declaration, typeArgument, references = []) {
    this.declaration = declaration
    this.typeArgument = typeArgument
    this.references = references
  }

  addReference (reference) {
    return new References(
      this.declaration,
      this.typeArgument,
      this.references.concat(reference)
    )
  }
}
