import * as t from './tokens'
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
        type: t.EOF,
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

    if ((m = /^\s/.exec(tail))) {
      return [t.WHITESPACE, m[0]]
    }

    if ((m = /^\/\/.*/.exec(tail))) {
      return [t.SINGLE_LINE_COMMENT, m[0]]
    }
    if ((m = /^\/\*[^]*\*\//.exec(tail))) {
      return [t.MULTI_LINE_COMMENT, m[0]]
    }

    if ((m = /^\bmodule\b/.exec(tail))) {
      return [t.MODULE_KEYWORD, m[0]]
    }
    if ((m = /^\buse\b/.exec(tail))) {
      return [t.USE_KEYWORD, m[0]]
    }
    if ((m = /^\bstruct\b/.exec(tail))) {
      return [t.STRUCT_KEYWORD, m[0]]
    }
    if ((m = /^\bclass\b/.exec(tail))) {
      return [t.CLASS_KEYWORD, m[0]]
    }
    if ((m = /^\bactor\b/.exec(tail))) {
      return [t.ACTOR_KEYWORD, m[0]]
    }
    if ((m = /^\binterface\b/.exec(tail))) {
      return [t.INTERFACE_KEYWORD, m[0]]
    }
    if ((m = /^\bconst\b/.exec(tail))) {
      return [t.CONST_KEYWORD, m[0]]
    }
    if ((m = /^\bprivate\b/.exec(tail))) {
      return [t.PRIVATE_KEYWORD, m[0]]
    }
    if ((m = /^\bpublic\b/.exec(tail))) {
      return [t.PUBLIC_KEYWORD, m[0]]
    }
    if ((m = /^\bdelegate\b/.exec(tail))) {
      return [t.DELEGATE_KEYWORD, m[0]]
    }
    if ((m = /^\breturn\b/.exec(tail))) {
      return [t.RETURN_KEYWORD, m[0]]
    }
    if ((m = /^\bif\b/.exec(tail))) {
      return [t.IF_KEYWORD, m[0]]
    }
    if ((m = /^\blet\b/.exec(tail))) {
      return [t.LET_KEYWORD, m[0]]
    }

    if ((m = /^\./.exec(tail))) {
      return [t.PERIOD, m[0]]
    }
    if ((m = /^:/.exec(tail))) {
      return [t.COLON, m[0]]
    }
    if ((m = /^,/.exec(tail))) {
      return [t.COMMA, m[0]]
    }
    if ((m = /^@/.exec(tail))) {
      return [t.AT, m[0]]
    }
    if ((m = /^=>/.exec(tail))) {
      return [t.FAT_ARROW, m[0]]
    }
    if ((m = /^->/.exec(tail))) {
      return [t.ARROW, m[0]]
    }
    if ((m = /^\*/.exec(tail))) {
      return [t.STAR, m[0]]
    }
    if ((m = /^\|/.exec(tail))) {
      return [t.PIPE, m[0]]
    }
    if ((m = /^&/.exec(tail))) {
      return [t.AMPERSAND, m[0]]
    }
    if ((m = /^"/.exec(tail))) {
      return [t.DOUBLE_QUOTE, m[0]]
    }
    if ((m = /^'/.exec(tail))) {
      return [t.SINGLE_QUOTE, m[0]]
    }
    if ((m = /^\\./.exec(tail))) {
      return [t.ESCAPED_CHAR, m[0]]
    }

    if ((m = /^=/.exec(tail))) {
      return [t.ASSIGN_OPERATOR, m[0]]
    }

    if ((m = /^{/.exec(tail))) {
      return [t.BEGIN_CURLY_BRACE, m[0]]
    }
    if ((m = /^}/.exec(tail))) {
      return [t.END_CURLY_BRACE, m[0]]
    }
    if ((m = /^\(/.exec(tail))) {
      return [t.BEGIN_PAREN, m[0]]
    }
    if ((m = /^\)/.exec(tail))) {
      return [t.END_PAREN, m[0]]
    }
    if ((m = /^</.exec(tail))) {
      return [t.BEGIN_ANGLE_BRACKET, m[0]]
    }
    if ((m = /^>/.exec(tail))) {
      return [t.END_ANGLE_BRACKET, m[0]]
    }
    if ((m = /^\[/.exec(tail))) {
      return [t.BEGIN_SQUARE_BRACKET, m[0]]
    }
    if ((m = /^\]/.exec(tail))) {
      return [t.END_SQUARE_BRACKET, m[0]]
    }

    if ((m = /^\d+\.\d+/.exec(tail))) {
      return [t.FLOAT_LITERAL, m[0]]
    }
    if ((m = /^\d+/.exec(tail))) {
      return [t.INTEGER_LITERAL, m[0]]
    }

    if ((m = /^\b[a-zA-Z_][a-zA-Z0-9_]*'*/.exec(tail))) {
      return [t.SYMBOL, m[0]]
    }

    return [t.UNKNOWN, tail[0]]
  }

  get tail () {
    return this._code.substr(this._cursor)
  }

  get head () {
    return this._code.substr(0, this._cursor)
  }
}
