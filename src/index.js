import Lexer from './Lexer'
import Parser from './Parser'
import Optimizer from './Optimizer'

import * as ast from './ast'
import * as tokens from './tokens'

import ErlangGenerator from './generators/ErlangGenerator'
import JavaScriptGenerator from './generators/JavaScriptGenerator'

import MessageAggregator from './MessageAggregator'

import SyntaxError from './errors/SyntaxError'
import ParserError from './errors/ParserError'
import AnalysisError from './errors/AnalysisError'
import OptimizerError from './errors/OptimizerError'

export {
  Lexer,
  SyntaxError,
  Parser,
  ParserError,
  Optimizer,
  OptimizerError,
  AnalysisError,
  ast,
  tokens
}

export class Compilation {
  constructor (filename, ast, messages) {
    this.filename = filename
    this.ast = ast
    this.messages = messages
  }

  static from (filename, code) {
    const messages = new MessageAggregator()
    return new this(
      filename,
      Optimizer.optimize(
        filename,
        code,
        Parser.parse(
          filename,
          code,
          Lexer.tokenize(code)
        ),
        messages
      ),
      messages
    )
  }

  toErlang () {
    return ErlangGenerator.emit(
      this.filename,
      this.ast
    )
  }

  toJavaScript () {
    return JavaScriptGenerator.emit(
      this.ast
    )
  }
}
