export default class CodePath {
  constructor (statements) {
    this.statements = statements
  }

  push (statement) {
    return new CodePath(
      this.statements.concat(statement)
    )
  }
}

CodePath.empty = new CodePath([])
