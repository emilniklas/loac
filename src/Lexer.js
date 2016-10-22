import {
  EOF,
  WHITESPACE,

  SINGLE_LINE_COMMENT,
  MULTI_LINE_COMMENT,

  MODULE_KEYWORD,
  USE_KEYWORD,
  STRUCT_KEYWORD,
  CLASS_KEYWORD,
  ACTOR_KEYWORD,
  INTERFACE_KEYWORD,
  CONST_KEYWORD,
  PRIVATE_KEYWORD,
  PUBLIC_KEYWORD,
  DELEGATE_KEYWORD,
  RETURN_KEYWORD,
  IF_KEYWORD,
  LET_KEYWORD,

  PERIOD,
  COLON,
  COMMA,
  AT,
  FAT_ARROW,
  ARROW,
  STAR,
  PIPE,

  ASSIGN_OPERATOR,

  BEGIN_CURLY_BRACE,
  END_CURLY_BRACE,
  BEGIN_PAREN,
  END_PAREN,
  BEGIN_ANGLE_BRACKET,
  END_ANGLE_BRACKET,
  BEGIN_SQUARE_BRACKET,
  END_SQUARE_BRACKET,

  FLOAT_LITERAL,
  INTEGER_LITERAL,

  SYMBOL,
} from './tokens'
import SyntaxError from './errors/SyntaxError'

export default class Lexer {
  constructor (code, tokens = [], cursor = 0) {
    this._code = code
    this._tokens = tokens
    this._cursor = cursor
  }

  static tokenize (code) {
    return new Lexer(code).lex()
  }

  lex () {
    const tail = this.tail
    const location = this.location

    if (tail === '') {
      return this._tokens.concat({
        type: EOF,
        content: '',
        location
      })
    }

    const [type, content] = this._nextToken(tail)
    const cursor = this._cursor + content.length
    const token = { type, content, location }

    return new Lexer(
      this._code,
      this._tokens.concat(token),
      cursor
    ).lex()
  }

  get location () {
    const lines = this.head.split('\n')
    const line = lines.length
    const char = lines[lines.length - 1].length
    return ['<unknown>', line, char]
  }

  _nextToken (tail) {
    let m

    if (m = /^\s/.exec(tail)) {
      return [WHITESPACE, m[0]]
    }

    if (m = /^\/\/.*/.exec(tail)) {
      return [SINGLE_LINE_COMMENT, m[0]]
    }
    if (m = /^\/\*[^]*\*\//.exec(tail)) {
      return [MULTI_LINE_COMMENT, m[0]]
    }

    if (m = /^\bmodule\b/.exec(tail)) {
      return [MODULE_KEYWORD, m[0]]
    }
    if (m = /^\buse\b/.exec(tail)) {
      return [USE_KEYWORD, m[0]]
    }
    if (m = /^\bstruct\b/.exec(tail)) {
      return [STRUCT_KEYWORD, m[0]]
    }
    if (m = /^\bclass\b/.exec(tail)) {
      return [CLASS_KEYWORD, m[0]]
    }
    if (m = /^\bactor\b/.exec(tail)) {
      return [ACTOR_KEYWORD, m[0]]
    }
    if (m = /^\binterface\b/.exec(tail)) {
      return [INTERFACE_KEYWORD, m[0]]
    }
    if (m = /^\bconst\b/.exec(tail)) {
      return [CONST_KEYWORD, m[0]]
    }
    if (m = /^\bprivate\b/.exec(tail)) {
      return [PRIVATE_KEYWORD, m[0]]
    }
    if (m = /^\bpublic\b/.exec(tail)) {
      return [PUBLIC_KEYWORD, m[0]]
    }
    if (m = /^\bdelegate\b/.exec(tail)) {
      return [DELEGATE_KEYWORD, m[0]]
    }
    if (m = /^\breturn\b/.exec(tail)) {
      return [RETURN_KEYWORD, m[0]]
    }
    if (m = /^\bif\b/.exec(tail)) {
      return [IF_KEYWORD, m[0]]
    }
    if (m = /^\blet\b/.exec(tail)) {
      return [LET_KEYWORD, m[0]]
    }

    if (m = /^\./.exec(tail)) {
      return [PERIOD, m[0]]
    }
    if (m = /^:/.exec(tail)) {
      return [COLON, m[0]]
    }
    if (m = /^,/.exec(tail)) {
      return [COMMA, m[0]]
    }
    if (m = /^@/.exec(tail)) {
      return [AT, m[0]]
    }
    if (m = /^=>/.exec(tail)) {
      return [FAT_ARROW, m[0]]
    }
    if (m = /^->/.exec(tail)) {
      return [ARROW, m[0]]
    }
    if (m = /^\*/.exec(tail)) {
      return [STAR, m[0]]
    }
    if (m = /^\|/.exec(tail)) {
      return [PIPE, m[0]]
    }

    if (m = /^=/.exec(tail)) {
      return [ASSIGN_OPERATOR, m[0]]
    }

    if (m = /^{/.exec(tail)) {
      return [BEGIN_CURLY_BRACE, m[0]]
    }
    if (m = /^}/.exec(tail)) {
      return [END_CURLY_BRACE, m[0]]
    }
    if (m = /^\(/.exec(tail)) {
      return [BEGIN_PAREN, m[0]]
    }
    if (m = /^\)/.exec(tail)) {
      return [END_PAREN, m[0]]
    }
    if (m = /^\</.exec(tail)) {
      return [BEGIN_ANGLE_BRACKET, m[0]]
    }
    if (m = /^\>/.exec(tail)) {
      return [END_ANGLE_BRACKET, m[0]]
    }
    if (m = /^\[/.exec(tail)) {
      return [BEGIN_SQUARE_BRACKET, m[0]]
    }
    if (m = /^\]/.exec(tail)) {
      return [END_SQUARE_BRACKET, m[0]]
    }

    if (m = /^\d+\.\d+/.exec(tail)) {
      return [FLOAT_LITERAL, m[0]]
    }
    if (m = /^\d+/.exec(tail)) {
      return [INTEGER_LITERAL, m[0]]
    }

    if (m = /^\b[a-zA-Z_][a-zA-Z0-9_]*'*/.exec(tail)) {
      return [SYMBOL, m[0]]
    }

    throw new SyntaxError(this._code, this._cursor, 'Unknown token')
  }

  get tail () {
    return this._code.substr(this._cursor)
  }

  get head () {
    return this._code.substr(0, this._cursor)
  }
}
