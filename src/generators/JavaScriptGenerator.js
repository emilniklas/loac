export default class JavaScriptGenerator {
  constructor (ast) {
    this._ast = ast
  }

  static emit (ast) {
    return new JavaScriptGenerator(ast)
      ._emitProgram()
  }

  _emitProgram () {
    return 'console.log($f());'
  }
}
