import Lexer from './Lexer'
import Parser from './Parser'
import Optimizer from './Optimizer'

import ErlangGenerator from './generators/ErlangGenerator'

export class Compilation {
  constructor (filePath, ast) {
    this.filePath = filePath
    this.ast = ast
  }

  static from (filePath, code) {
    return new this(
      filePath,
      Optimizer.optimize(
        Parser.parse(
          Lexer.tokenize(code)
        )
      )
    )
  }

  toErlang () {
    return ErlangGenerator.emit(
      this.filePath,
      this.ast
    )
  }
}
