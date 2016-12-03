import * as ast from './ast'
import * as t from './tokens'
import ParserError from './errors/ParserError'
import ExpressionParser from './ExpressionParser'

export default class Parser {
  constructor (
    filename,
    code,
    tokens,
    cursor = 0
  ) {
    this._filename = filename
    this._code = code
    this._tokens = tokens
    if (this._tokens == null) {
      throw new Error('WARN')
    }
    this._cursor = cursor
  }

  static parse (filename, code, tokens) {
    return this.load(filename, code, tokens)
      ._parseProgram()
  }

  static load (filename, code, tokens) {
    return new Parser(
      filename,
      code,
      tokens.filter((tk) => {
        return tk.type !== t.WHITESPACE
      }).filter((tk) => {
        return tk.type !== t.SINGLE_LINE_COMMENT
      }).filter((tk) => {
        return tk.type !== t.MULTI_LINE_COMMENT
      })
    )
  }

  get _current () {
    return this._tokens[this._cursor]
  }

  get _next () {
    return this._tokens[this._cursor + 1]
  }

  _expect (tokenType) {
    if (!this._is(tokenType)) {
      this._parserError(
        `Expected a ${tokenType} but saw a ${this._current.type}`
      )
    }
  }

  _is (tokenType) {
    return this._current.type === tokenType
  }

  _isAnyOf (...tokenTypes) {
    return tokenTypes.includes(this._current.type)
  }

  _nextIs (tokenType) {
    return this._next.type === tokenType
  }

  _isEOF () {
    return this._is(t.EOF)
  }

  _isVisibility () {
    return this._is(t.PUBLIC_KEYWORD) ||
      this._is(t.PRIVATE_KEYWORD)
  }

  _multi (condition, parse) {
    let result = []
    while (condition()) {
      if (this._is(t.EOF)) {
        this._parserError(
          'Unexpected end of input'
        )
      }

      result.push(parse.call(this))
    }
    return result
  }

  _move () {
    const pop = this._current
    this._cursor++
    return pop
  }

  _parserError (message) {
    throw new ParserError(
      this._filename, this._code,
      this._tokens, this._cursor, message
    )
  }

  _if (condition, parse) {
    const conditionFunc =
      typeof condition === 'function'
        ? condition : () => this._is(condition)

    if (conditionFunc()) {
      return parse.call(this)
    }
    return null
  }

  _consume (token) {
    this._expect(token)
    return this._move()
  }

  /**
   * Program ::=
   *   ModuleStatement?
   *   UseStatement*
   *   TopLevelDeclaration*
   */
  _parseProgram () {
    const moduleStatement =
      this._is(t.MODULE_KEYWORD)
        ? this._parseModuleStatement()
        : null

    return new ast.Program(
      moduleStatement,
      this._multi(
        () => this._is(t.USE_KEYWORD),
        this._parseUseStatement
      ),
      this._multi(
        () => !this._isEOF(),
        this._parseTopLevelDeclaration
      ),
    )
  }

  /**
   * ModuleStatement ::=
   *   MODULE_KEYWORD
   *   ModuleIdentifier
   */
  _parseModuleStatement () {
    const moduleKeyword = this._move()
    const moduleIdentifier = this._parseModuleIdentifier()
    return new ast.ModuleStatement(
      moduleKeyword,
      moduleIdentifier
    )
  }

  /**
   * ModuleIdentifier ::=
   *  SimpleIdentifier
   *  (SimpleIdentifier PERIOD)*
   */
  _parseModuleIdentifier (carry = []) {
    const simpleIdentifier = this._parseSimpleIdentifier()
    const identifiers = carry.concat(simpleIdentifier)
    if (this._is(t.PERIOD)) {
      this._move()
      return this._parseModuleIdentifier(
        identifiers
      )
    }
    return new ast.ModuleIdentifier(identifiers)
  }

  /**
   * SimpleIdentifier ::=
   *   SYMBOL
   */
  _parseSimpleIdentifier () {
    this._expect(t.SYMBOL)
    const symbol = this._move()
    return new ast.SimpleIdentifier(symbol)
  }

  /**
   * UseStatement ::=
   *   USE_KEYWORD
   *   QualifiedIdentifier
   */
  _parseUseStatement () {
    this._expect(t.USE_KEYWORD)
    const use = this._move()
    const id = this._parseQualifiedIdentifier()
    return new ast.UseStatement(
      use,
      id
    )
  }

  /**
   * QualifiedIdentifier ::=
   *   ModuleIdentifier
   *   PERIOD
   *   SimpleIdentifier
   */
  _parseQualifiedIdentifier () {
    // This will consume all simple identifiers,
    // so we need to pop off the last one and
    // use that as the last identifier in the
    // qualified identifier.
    const identifiers = this._parseModuleIdentifier().simpleIdentifiers

    const moduleIdentifier = new ast.ModuleIdentifier(
      identifiers.slice(0, identifiers.length - 1)
    )
    const simpleIdentifier = identifiers[identifiers.length - 1]

    return new ast.QualifiedIdentifier(
      moduleIdentifier,
      simpleIdentifier
    )
  }

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
  _parseTopLevelDeclaration () {
    // PARSER ANNOTATIONS
    const visibility = this._parseVisibility()

    const declaration = (() => {
      switch (this._current.type) {
        case t.CONST_KEYWORD:
          return this._parseConstantDeclaration()
        case t.INTERFACE_KEYWORD:
          return this._parseInterfaceDeclaration()
        case t.ACTOR_KEYWORD:
          return this._parseActorDeclaration()
        case t.CLASS_KEYWORD:
          return this._parseClassDeclaration()
        case t.STRUCT_KEYWORD:
          return this._parseStructDeclaration()
        case t.SYMBOL:
          return this._parseFunctionDeclaration()
      }
      this._parserError(
        'Expected a top level declaration'
      )
    })()

    return new ast.TopLevelDeclaration(
      [], visibility, declaration
    )
  }

  /**
   * Visibility ::=
   *   PRIVATE_KEYWORD |
   *   PUBLIC_KEYWORD
   */
  _parseVisibility () {
    switch (this._current.type) {
      case t.PUBLIC_KEYWORD:
        return new ast.Visibility(this._move())
      case t.PRIVATE_KEYWORD:
        return new ast.Visibility(this._move())
    }
    this._parserError(
      'Expected "public" or "private"'
    )
  }

  /**
   * ConstantDeclaration ::=
   *   CONST_KEYWORD
   *   Assignment
   */
  _parseConstantDeclaration () {
    this._expect(t.CONST_KEYWORD)

    const keyword = this._move()
    const assignment = this._parseAssignment()

    return new ast.ConstantDeclaration(
      keyword, assignment
    )
  }

  /**
   * Assignment ::=
   *   TypedPattern
   *   (
   *     EQUALS_SIGN
   *     Expression
   *   )?
   */
  _parseAssignment () {
    const pattern = this._parseTypedPattern()

    if (!this._is(t.EQUALS_SIGN)) {
      return new ast.Assignment(pattern)
    }

    this._move() // =

    const expression = this._parseExpression()

    return new ast.Assignment(
      pattern, expression
    )
  }

  /*
   * Pattern ::=
   *   ( NamePattern
   *   )
   */
  _parsePattern () {
    switch (this._current.type) {
      case t.SYMBOL:
        return this._parseNamePattern()
    }

    this._parserError(
      'Expected a pattern'
    )
  }

  /**
   * NamePattern ::=
   *   SimpleIdentifier
   */
  _parseNamePattern () {
    return new ast.NamePattern(
      this._parseSimpleIdentifier()
    )
  }

  /**
   * Expression ::=
   *   ( IntegerLiteralExpression
   *   | FloatLiteralExpression
   *   | ListLiteralExpression
   *   | DictLiteralExpression
   *   | StringLiteralExpression
   *   | CharLiteralExpression
   *   | TupleLiteralExpression
   *   | BoolLiteralExpression
   *   | ValueExpression
   *   | FunctionExpression
   *   | CallExpression
   *   )
   */
  _parseExpression () {
    return new ExpressionParser(this).parse()
  }

  /**
   * IntegerLiteralExpression ::=
   *   INTEGER_LITERAL
   */
  _parseIntegerLiteralExpression () {
    return new ast.IntegerLiteralExpression(
      this._consume(t.INTEGER_LITERAL)
    )
  }

  /**
   * FloatLiteralExpression ::=
   *   FLOAT_LITERAL
   */
  _parseFloatLiteralExpression () {
    return new ast.FloatLiteralExpression(
      this._consume(t.FLOAT_LITERAL)
    )
  }

  /**
   * StringLiteralExpression ::=
   *   DOUBLE_QUOTE
   *   ( AnyToken
   *   | StringInterpolation
   *   )*
   *   DOUBLE_QUOTE
   */
  _parseStringLiteralExpression () {
    const beginQuote = this._consume(t.DOUBLE_QUOTE)
    let parts = []
    while (!this._is(t.DOUBLE_QUOTE)) {
      if (this._is(t.BEGIN_CURLY_BRACE)) {
        parts.push(this._parseStringInterpolation())
      } else {
        parts.push(this._move())
      }
    }
    const endQuote = this._consume(t.DOUBLE_QUOTE)

    return new ast.StringLiteralExpression(
      beginQuote, parts, endQuote
    )
  }

  /**
   * StringInterpolation ::=
   *   BEGIN_CURLY_BRACE
   *   Expression
   *   END_CURLY_BRACE
   */
  _parseStringInterpolation () {
    const begin = this._consume(t.BEGIN_CURLY_BRACE)
    const expression = this._parseExpression()
    const end = this._consume(t.END_CURLY_BRACE)

    return new ast.StringInterpolation(
      begin, expression, end
    )
  }

  /**
   * ValueExpression ::=
   *   SimpleIdentifier
   */
  _parseValueExpression () {
    const identifier = this._parseSimpleIdentifier()

    return new ast.ValueExpression(
      identifier
    )
  }

  _movePastParens () {
    this._consume(t.BEGIN_PAREN)
    while (true) {
      if (this._is(t.END_PAREN)) {
        this._move()
        break
      }
      if (this._is(t.BEGIN_PAREN)) {
        this._movePastParens()
        continue
      }
      this._move()
    }
  }

  _parseTupleOrFunctionExpression () {
    const beforeParens = this._cursor
    this._movePastParens()

    const parse = this._isAnyOf(t.FAT_ARROW, t.ARROW, t.BEGIN_CURLY_BRACE)
      ? this._parseFunctionExpression
      : this._parseTupleLiteralExpression

    this._cursor = beforeParens
    return parse.call(this)
  }

  /**
   * TupleLiteralExpression ::=
   *   BEGIN_PAREN
   *   (Expression COMMA?)*
   *   END_PAREN
   */
  _parseTupleLiteralExpression () {
    const begin = this._consume(t.BEGIN_PAREN)
    const expressions = this._multi(
      () => {
        if (this._is(t.COMMA)) {
          this._move()
        }
        return !this._is(t.END_PAREN)
      },
      this._parseExpression
    )
    const end = this._consume(t.END_PAREN)

    return new ast.TupleLiteralExpression(
      begin,
      expressions,
      end
    )
  }

  /**
   * BoolLiteralExpression ::=
   *   TRUE_KEYWORD | FALSE_KEYWORD
   */
  _parseBoolLiteralExpression () {
    if (!this._is(t.TRUE_KEYWORD) && !this._is(t.FALSE_KEYWORD)) {
      this._parserError(
        'Expected a boolean literal (true or false)'
      )
    }

    return new ast.BoolLiteralExpression(
      this._move()
    )
  }

  /**
   * ObjectDeclaration ::=
   *   SimpleIdentifier
   *   Generics?
   *   (COLON TypeArgument)?
   *   ObjectBody?
   */
  _parseObjectDeclaration () {
    const identifier = this._parseSimpleIdentifier()
    const generics = this._is(t.BEGIN_ANGLE_BRACKET)
      ? this._parseGenerics()
      : null
    const typeArgument = this._is(t.COLON)
      ? this._move() && this._parseTypeArgument()
      : null
    const body = this._is(t.BEGIN_CURLY_BRACE)
      ? this._parseObjectBody()
      : null

    return new ast.ObjectDeclaration(
      identifier,
      generics,
      typeArgument,
      body
    )
  }

  /**
   * InterfaceDeclaration ::=
   *   INTERFACE_KEYWORD
   *   ObjectDeclaration
   */
  _parseInterfaceDeclaration () {
    const keyword = this._consume(t.INTERFACE_KEYWORD)
    const declaration = this._parseObjectDeclaration()

    return new ast.InterfaceDeclaration(
      keyword,
      declaration
    )
  }

  /**
   * StructDeclaration ::=
   *   STRUCT_KEYWORD
   *   ObjectDeclaration
   */
  _parseStructDeclaration () {
    const keyword = this._consume(t.STRUCT_KEYWORD)
    const declaration = this._parseObjectDeclaration()

    return new ast.StructDeclaration(
      keyword,
      declaration
    )
  }

  /**
   * ClassDeclaration ::=
   *   CLASS_KEYWORD
   *   ObjectDeclaration
   */
  _parseClassDeclaration () {
    const keyword = this._consume(t.CLASS_KEYWORD)
    const declaration = this._parseObjectDeclaration()

    return new ast.ClassDeclaration(
      keyword,
      declaration
    )
  }

  /**
   * ActorDeclaration ::=
   *   ACTOR_KEYWORD
   *   ObjectDeclaration
   */
  _parseActorDeclaration () {
    const keyword = this._consume(t.ACTOR_KEYWORD)
    const declaration = this._parseObjectDeclaration()

    return new ast.ActorDeclaration(
      keyword,
      declaration
    )
  }

  /**
   * ObjectBody ::=
   *   BEGIN_CURLY_BRACE
   *   Field*
   *   END_CURLY_BRACE
   */
  _parseObjectBody () {
    this._expect(t.BEGIN_CURLY_BRACE)
    const begin = this._move()
    const fields = this._multi(
      () => !this._is(t.END_CURLY_BRACE),
      this._parseField
    )
    this._expect(t.END_CURLY_BRACE)
    const end = this._move()

    return new ast.ObjectBody(
      begin, fields, end
    )
  }

  /**
   * Field ::=
   *   Annotation*
   *   Visibility
   *   (STATIC_KEYWORD | CONST_KEYWORD | DELEGATE_KEYWORD)?
   *   FieldName?
   *   FieldBody?
   */
  _parseField () {
    const annotations = []
    const visibility = this._parseVisibility()
    const keyword = (() => {
      switch (this._current.type) {
        case t.STATIC_KEYWORD:
        case t.CONST_KEYWORD:
        case t.DELEGATE_KEYWORD:
          return this._move()
        default:
          return null
      }
    })()
    const name = !this._is(t.BEGIN_PAREN)
      ? this._parseFieldName()
      : null
    const body = this._isAnyOf(
      t.EQUALS_SIGN,
      t.COLON,
      t.FAT_ARROW,
      t.BEGIN_PAREN
    )
      ? this._parseFieldBody()
      : null

    return new ast.Field(
      annotations,
      visibility,
      keyword,
      name,
      body
    )
  }

  /**
   * FieldName ::=
   *   SimpleIdentifier |
   *   OverloadableOperator
   */
  _parseFieldName () {
    return new ast.FieldName((() => {
      switch (this._current.type) {
        case t.SYMBOL:
          return this._parseSimpleIdentifier()
        default:
          this._parserError(
            'Expected a valid field name (overloadable operator or symbol)'
          )
      }
    })())
  }

  /**
   * FieldBody ::=
   *   TypeAnnotation? (EQUALS_SIGN Expression | FunctionBody)? |
   *   FunctionExpression
   */
  _parseFieldBody () {
    return new ast.FieldBody(...(() => {
      switch (this._current.type) {
        case t.COLON:
          this._move() // :
          const type = this._parseTypeArgument()
          const expression = this._is(t.EQUALS_SIGN)
            ? this._move() && this._parseExpression()
            : null
          const computeBody = this._isAnyOf(t.BEGIN_CURLY_BRACE, t.FAT_ARROW)
            ? this._parseFunctionBody()
            : null
          return [type, computeBody, expression]
        case t.BEGIN_CURLY_BRACE:
        case t.FAT_ARROW:
          return [null, this._parseFunctionBody()]
        case t.EQUALS_SIGN:
          this._move() // =
          return [null, null, this._parseExpression()]
        case t.BEGIN_PAREN:
          return [null, null, this._parseFunctionExpression()]
        default:
          this._parserError(
            'Expected a type annotation, an assignment, or a function expression'
          )
      }
    })())
  }

  /**
   * FunctionDeclaration ::=
   *   SimpleIdentifier
   *   FunctionExpression
   */
  _parseFunctionDeclaration () {
    const identifier = this._parseSimpleIdentifier()
    const functionExpression = this._parseFunctionExpression()

    return new ast.FunctionDeclaration(
      identifier, functionExpression
    )
  }

  /**
   * FunctionExpression ::=
   *   ParameterList
   *   ReturnType?
   *   FunctionBody?
   */
  _parseFunctionExpression () {
    const parameterList = this._parseParameterList()
    const returnType = this._if(t.ARROW, this._parseReturnType)
    const body = this._is(t.FAT_ARROW) || this._is(t.BEGIN_CURLY_BRACE)
      ? this._parseFunctionBody()
      : null

    return new ast.FunctionExpression(
      parameterList, returnType, body
    )
  }

  /**
   * FunctionBody ::=
   *   ExpressionFunctionBody |
   *   BlockFunctionBody
   */
  _parseFunctionBody () {
    switch (this._current.type) {
      case t.FAT_ARROW:
        return this._parseExpressionFunctionBody()
      case t.BEGIN_CURLY_BRACE:
        return this._parseBlockFunctionBody()
      default:
        this._parserError(
          'Expected "=>" or "{"'
        )
    }
  }

  /**
   * ParameterList ::=
   *   BEGIN_PAREN
   *   (TypedPattern COMMA?)*
   *   END_PAREN
   */
  _parseParameterList () {
    const beginParen = this._consume(t.BEGIN_PAREN)
    const patterns = this._multi(
      () => {
        if (this._is(t.COMMA)) {
          this._move()
        }
        return !this._is(t.END_PAREN)
      },
      this._parseTypedPattern
    )
    const endParen = this._consume(t.END_PAREN)

    return new ast.ParameterList(
      beginParen, patterns, endParen
    )
  }

  /**
   * TypedPattern ::=
   *   Pattern
   *   (COLON TypeArgument)?
   */
  _parseTypedPattern () {
    const pattern = this._parsePattern()
    const typeArgument = (() => {
      if (!this._is(t.COLON)) {
        return null
      }

      this._move() // :

      return this._parseTypeArgument()
    })()

    return new ast.TypedPattern(
      pattern, typeArgument
    )
  }

  /**
   * ExpressionFunctionBody ::=
   *   FAT_ARROW
   *   Expression
   */
  _parseExpressionFunctionBody () {
    const arrow = this._consume(t.FAT_ARROW)
    const expression = this._parseExpression()

    return new ast.ExpressionFunctionBody(
      arrow, expression
    )
  }

  /**
   * BlockFunctionBody ::=
   *   BEGIN_CURLY_BRACE
   *   Statement*
   *   END_CURLY_BRACE
   */
  _parseBlockFunctionBody () {
    const beginCurly = this._consume(t.BEGIN_CURLY_BRACE)
    const statements = this._multi(
      () => !this._is(t.END_CURLY_BRACE),
      this._parseStatement
    )
    const endCurly = this._consume(t.END_CURLY_BRACE)

    return new ast.BlockFunctionBody(
      beginCurly, statements, endCurly
    )
  }

  /**
   * ReturnType ::=
   *   ARROW
   *   TypeArgument
   */
  _parseReturnType () {
    const arrow = this._consume(t.ARROW)
    const typeArgument = this._parseTypeArgument()

    return new ast.ReturnType(
      arrow, typeArgument
    )
  }

  /**
   * TypeArgument ::=
   *   ( TypeReference
   *   | ListTypeArgument
   *   | DictTypeArgument
   *   | TupleTypeArgument
   *   | FutureTypeArgument
   *   | FunctionTypeArgument
   *   | UnionTypeArgument
   *   | IntersectionTypeArgument
   *   )
   */
  _parseTypeArgument () {
    const first = this._parseSingleTypeArgument()

    if (this._is(t.PIPE)) {
      this._move()
      return this._parseUnionTypeArgument([first])
    }

    if (this._is(t.AMPERSAND)) {
      this._move()
      return this._parseIntersectionTypeArgument([first])
    }

    return first
  }

  _parseSingleTypeArgument () {
    switch (this._current.type) {
      case t.SYMBOL:
        return this._parseTypeReference()
      case t.BEGIN_SQUARE_BRACKET:
        return this._parseListOrDictTypeArgument()
      case t.BEGIN_PAREN:
        const tuple = this._parseTupleTypeArgument()
        if (this._is(t.ARROW)) {
          return new ast.FunctionTypeArgument(
            tuple,
            this._parseReturnType()
          )
        }
        return tuple
      case t.STAR:
        return this._parseFutureTypeArgument()
      default:
        this._parserError(
          'Expected a type argument'
        )
    }
  }

  /**
   * TypeReference ::=
   *   Identifier
   *   TypeArguments?
   */
  _parseTypeReference () {
    const identifier = this._parseIdentifier()
    const typeArguments = this._if(
      t.BEGIN_ANGLE_BRACKET,
      this._parseTypeArguments
    )

    return new ast.TypeReference(
      identifier, typeArguments
    )
  }

  /**
   * TypeArguments ::=
   *   BEGIN_ANGLE_BRACKET
   *   TypeArgument
   *   (TypeArgument COMMA?)*
   *   END_ANGLE_BRACKET
   */
  _parseTypeArguments () {
    const begin = this._consume(t.BEGIN_ANGLE_BRACKET)
    const typeArguments = this._multi(
      () => {
        if (this._is(t.COMMA)) {
          this._move()
        }
        return !this._is(t.END_ANGLE_BRACKET)
      },
      this._parseTypeArgument
    )

    if (typeArguments.length === 0) {
      this._parserError(
        'Expected a type argument'
      )
    }

    const end = this._consume(t.END_ANGLE_BRACKET)

    return new ast.TypeArguments(
      begin, typeArguments, end
    )
  }

  /**
   * Identifier ::=
   *   QualifiedIdentifier |
   *   SimpleIdentifier
   */
  _parseIdentifier () {
    const first = this._parseSimpleIdentifier()
    const rest = this._multi(
      () => {
        if (!this._is(t.PERIOD)) {
          return false
        }

        this._move() // .

        return true
      },
      this._parseSimpleIdentifier
    )

    if (rest.length === 0) {
      return first
    }

    const simpleIdentifiers = [first, ...rest]
    const last = simpleIdentifiers[simpleIdentifiers.length - 1]
    const moduleIdentifier = new ast.ModuleIdentifier(
      simpleIdentifiers.slice(0, simpleIdentifiers.length - 1)
    )

    return new ast.QualifiedIdentifier(
      moduleIdentifier,
      last
    )
  }

  /**
   * ListTypeReference ::=
   *   BEGIN_SQUARE_BRACKET
   *   TypeArgument
   *   END_SQUARE_BRACKET
   */
  _parseListTypeArgument () {
    const begin = this._consume(t.BEGIN_SQUARE_BRACKET)
    const typeArgument = this._parseTypeArgument()
    const end = this._consume(t.END_SQUARE_BRACKET)

    return new ast.ListTypeArgument(
      begin, typeArgument, end
    )
  }

  /**
   * (ListTypeArgument | DictTypeArgument)
   */
  _parseListOrDictTypeArgument () {
    const begin = this._consume(t.BEGIN_SQUARE_BRACKET)
    const firstTypeArgument = this._parseTypeArgument()

    switch (this._current.type) {
      case t.END_SQUARE_BRACKET:
        const listEnd = this._consume(t.END_SQUARE_BRACKET)

        return new ast.ListTypeArgument(
          begin, firstTypeArgument, listEnd
        )
      case t.COLON:
        const colon = this._move() // :
        const valueTypeArgument = this._parseTypeArgument()
        const dictEnd = this._consume(t.END_SQUARE_BRACKET)

        return new ast.DictTypeArgument(
          begin, firstTypeArgument, colon, valueTypeArgument, dictEnd
        )
      default:
        this._parserError(
          'Expected ":" or "]"'
        )
    }
  }

  /**
   * TupleTypeArgument ::=
   *   BEGIN_PAREN
   *   (TypeArgument COMMA?)*
   *   END_PAREN
   */
  _parseTupleTypeArgument () {
    const begin = this._consume(t.BEGIN_PAREN)
    const typeArguments = this._multi(
      () => !this._is(t.END_PAREN),
      () => {
        const next = this._parseTypeArgument()
        if (this._is(t.COMMA)) {
          this._move() // ,
        }
        return next
      }
    )
    const end = this._consume(t.END_PAREN)

    return new ast.TupleTypeArgument(
      begin, typeArguments, end
    )
  }

  /**
   * FutureTypeArgument ::=
   *   STAR
   *   TypeArgument
   */
  _parseFutureTypeArgument () {
    const star = this._consume(t.STAR)
    const type = this._parseTypeArgument()

    return new ast.FutureTypeArgument(
      star, type
    )
  }

  /**
   * UnionTypeArgument ::=
   *   TypeArgument
   *   (PIPE TypeArgument)+
   */
  _parseUnionTypeArgument (carry = []) {
    const types = carry.concat(
      this._parseSingleTypeArgument()
    )

    if (!this._is(t.PIPE)) {
      return new ast.UnionTypeArgument(
        types
      )
    }

    this._move()

    return this._parseUnionTypeArgument(types)
  }

  /**
   * IntersectionTypeArgument ::=
   *   TypeArgument
   *   (PIPE TypeArgument)+
   */
  _parseIntersectionTypeArgument (carry = []) {
    const types = carry.concat(
      this._parseSingleTypeArgument()
    )

    if (!this._is(t.AMPERSAND)) {
      return new ast.IntersectionTypeArgument(
        types
      )
    }

    this._move()

    return this._parseIntersectionTypeArgument(types)
  }

  /**
   * Statement ::=
   *   ( ReturnStatement
   *   | IfStatement
   *   | LetStatement
   *   )
   */
  _parseStatement () {
    switch (this._current.type) {
      case t.RETURN_KEYWORD:
        return this._parseReturnStatement()
      case t.IF_KEYWORD:
        return this._parseIfStatement()
      case t.LET_KEYWORD:
        return this._parseLetStatement()
      default:
        return this._parseExpression()
    }
  }

  /**
   * ReturnStatement ::=
   *   RETURN_KEYWORD
   *   Expression
   */
  _parseReturnStatement () {
    const keyword = this._consume(t.RETURN_KEYWORD)
    const expression = this._parseExpression()

    return new ast.ReturnStatement(
      keyword, expression
    )
  }

  /**
   * IfStatement ::=
   *   IF_KEYWORD
   *   Expression
   *   FunctionBody
   */
  _parseIfStatement () {
    const keyword = this._consume(t.IF_KEYWORD)
    const expression = this._parseExpression()
    const body = this._parseFunctionBody()

    return new ast.IfStatement(
      keyword, expression, body
    )
  }

  /**
   * LetStatement ::=
   *   LET_KEYWORD
   *   ( Assignment
   *   | FunctionDeclaration
   *   )
   */
  _parseLetStatement () {
    const keyword = this._consume(t.LET_KEYWORD)

    if (this._nextIs(t.BEGIN_PAREN)) {
      return new ast.LetStatement(
        keyword, this._parseFunctionDeclaration()
      )
    }

    if (this._nextIs(t.COLON) || this._nextIs(t.EQUALS_SIGN)) {
      return new ast.LetStatement(
        keyword, this._parseAssignment()
      )
    }

    this._parserError(
      'Expected a function declaration or an assignment'
    )
  }
}
