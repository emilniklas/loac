import * as t from './tokens'

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
    if (this._isWhitespace(tail)) {
      return [t.WHITESPACE, this._getWhitespace(tail)]
    }
    if (this._isSingleLineComment(tail)) {
      return [t.SINGLE_LINE_COMMENT, this._getSingleLineComment(tail)]
    }
    if (this._isMultiLineComment(tail)) {
      return [t.MULTI_LINE_COMMENT, this._getMultiLineComment(tail)]
    }
    // if ((m = /^\/\*[^]*\*\//.exec(tail))) {
    //   return [t.MULTI_LINE_COMMENT, m[0]]
    // }

    let m

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
    if ((m = /^\bconst\b/.exec(tail))) {
      return [t.CONST_KEYWORD, m[0]]
    }
    if ((m = /^\binterface\b/.exec(tail))) {
      return [t.INTERFACE_KEYWORD, m[0]]
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
    if ((m = /^\bstatic\b/.exec(tail))) {
      return [t.STATIC_KEYWORD, m[0]]
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
    if ((m = /^\bor\b/.exec(tail))) {
      return [t.OR_KEYWORD, m[0]]
    }
    if ((m = /^\band\b/.exec(tail))) {
      return [t.AND_KEYWORD, m[0]]
    }
    if ((m = /^\bnot\b/.exec(tail))) {
      return [t.NOT_KEYWORD, m[0]]
    }
    if ((m = /^\bwait\b/.exec(tail))) {
      return [t.WAIT_KEYWORD, m[0]]
    }
    if ((m = /^\bas\b/.exec(tail))) {
      return [t.AS_KEYWORD, m[0]]
    }
    if ((m = /^\bis\b/.exec(tail))) {
      return [t.IS_KEYWORD, m[0]]
    }
    if ((m = /^\btrue\b/.exec(tail))) {
      return [t.TRUE_KEYWORD, m[0]]
    }
    if ((m = /^\bfalse\b/.exec(tail))) {
      return [t.FALSE_KEYWORD, m[0]]
    }
    if ((m = /^\bthis\b/.exec(tail))) {
      return [t.THIS_KEYWORD, m[0]]
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
    if ((m = /^<=/.exec(tail))) {
      return [t.REVERSE_FAT_ARROW, m[0]]
    }
    if ((m = /^>=/.exec(tail))) {
      return [t.FUNNEL, m[0]]
    }
    if ((m = /^->/.exec(tail))) {
      return [t.ARROW, m[0]]
    }
    if ((m = /^\*/.exec(tail))) {
      return [t.STAR, m[0]]
    }
    if ((m = /^&/.exec(tail))) {
      return [t.AMPERSAND, m[0]]
    }
    if ((m = /^\|/.exec(tail))) {
      return [t.PIPE, m[0]]
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
    if ((m = /^==/.exec(tail))) {
      return [t.DOUBLE_EQUALS, m[0]]
    }
    if ((m = /^=/.exec(tail))) {
      return [t.EQUALS_SIGN, m[0]]
    }
    if ((m = /^\+/.exec(tail))) {
      return [t.PLUS_SIGN, m[0]]
    }
    if ((m = /^-/.exec(tail))) {
      return [t.DASH, m[0]]
    }
    if ((m = /^\//.exec(tail))) {
      return [t.SLASH, m[0]]
    }
    if ((m = /^%/.exec(tail))) {
      return [t.PERCENT_SIGN, m[0]]
    }
    if ((m = /^\^/.exec(tail))) {
      return [t.CARET, m[0]]
    }
    if ((m = /^#/.exec(tail))) {
      return [t.HASH, m[0]]
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
    if ((m = /^]/.exec(tail))) {
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

  // WHITESPACE
  _whitespaceChars = [' ', '\f', '\n', '\r', '\t', '\v']

  _getWhitespace (tail) {
    let buffer = ''
    let rest = tail

    while (this._isWhitespace(rest)) {
      buffer += rest[0]
      rest = rest.slice(1)
    }

    return buffer
  }

  _isWhitespace (tail) {
    return this._whitespaceChars.indexOf(tail[0]) !== -1
  }

  // SINGLE_LINE_COMMENT
  _lineBreakTokens = ['\r\n', '\n\r', '\n', '\r']

  _isSingleLineComment (tail) {
    return tail.slice(0, 2) === '//'
  }

  _getSingleLineComment (tail) {
    let buffer = ''
    let rest = tail

    const isEOL = () =>
      this._lineBreakTokens.indexOf(rest.slice(0, 2)) !== -1 ||
      this._lineBreakTokens.indexOf(rest[0]) !== -1

    const isNotDone = () =>
      rest.length > 0 && !isEOL()

    while (isNotDone()) {
      buffer += rest[0]
      rest = rest.slice(1)
    }

    if (isEOL()) {
      buffer += this._lineBreakTokens
        .filter((t) => rest.slice(0, t.length) === t)[0]
    }

    return buffer
  }

  // MULTI_LINE_COMMENT
  _isMultiLineComment (tail) {
    return tail.slice(0, 2) === '/*'
  }

  _getMultiLineComment (tail) {
    let buffer = tail.slice(0, 2)
    let rest = tail.slice(2)
    let bufferAtNestedEnd = null

    while (rest.length > 0 && rest.slice(0, 2) !== '*/') {
      if (this._isMultiLineComment(rest)) {
        const nested = this._getMultiLineComment(rest)
        buffer += nested
        rest = rest.slice(nested.length)
        bufferAtNestedEnd = buffer
      } else {
        buffer += rest[0]
        rest = rest.slice(1)
      }
    }

    if (rest.length > 0) {
      buffer += rest.slice(0, 2)
      rest = rest.slice(2)
    } else if (bufferAtNestedEnd != null) {
      return bufferAtNestedEnd
    }

    return buffer
  }
}
