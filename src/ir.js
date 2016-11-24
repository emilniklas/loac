import * as t from './tokens'
import * as ast from './ast'

export function token (type, content) {
  return {
    type,
    content,
    location: ['<unknown>', NaN, NaN]
  }
}

export function symbol (content) {
  return token(t.SYMBOL, content)
}

export const EOF = token(t.EOF, '')
export const RETURN_KEYWORD = token(t.RETURN_KEYWORD, 'return')
export const USE_KEYWORD = token(t.USE_KEYWORD, 'use')
export const TRUE_KEYWORD = token(t.TRUE_KEYWORD, 'true')
export const FALSE_KEYWORD = token(t.FALSE_KEYWORD, 'false')
export const AND_KEYWORD = token(t.AND_KEYWORD, 'and')
export const NOT_KEYWORD = token(t.NOT_KEYWORD, 'not')
export const OR_KEYWORD = token(t.OR_KEYWORD, 'or')
export const BEGIN_PAREN = token(t.BEGIN_PAREN, '(')
export const END_PAREN = token(t.END_PAREN, ')')
export const BEGIN_CURLY_BRACE = token(t.BEGIN_CURLY_BRACE, '{')
export const END_CURLY_BRACE = token(t.END_CURLY_BRACE, '}')
export const BEGIN_ANGLE_BRACKET = token(t.BEGIN_ANGLE_BRACKET, '<')
export const END_ANGLE_BRACKET = token(t.END_ANGLE_BRACKET, '>')
export const ARROW = token(t.ARROW, '->')
export const DASH = token(t.DASH, '-')
export const STAR = token(t.STAR, '*')
export const MINUS_SIGN = DASH
export const PLUS_SIGN = token(t.PLUS_SIGN, '+')
export const PERIOD = token(t.PERIOD, '.')

export const unitExpression =
  new ast.TupleLiteralExpression(
    BEGIN_PAREN,
    [],
    END_PAREN
  )

export function integer (number) {
  return token(t.INTEGER_LITERAL, String(number))
}

export function returnStatement (expression) {
  return new ast.ReturnStatement(
    RETURN_KEYWORD,
    expression
  )
}

export function typeReference (name, args = []) {
  return new ast.TypeReference(
    new ast.SimpleIdentifier(
      symbol(name)
    ),
    args.length === 0
      ? null
      : new ast.TypeArguments(
        BEGIN_ANGLE_BRACKET,
        args,
        END_ANGLE_BRACKET
      )
  )
}

export function useStatement (qualifiedString) {
  return new ast.UseStatement(
    USE_KEYWORD,
    qualifiedIdentifier(qualifiedString)
  )
}

export function simpleIdentifier (string) {
  return new ast.SimpleIdentifier(
    symbol(string)
  )
}

export function qualifiedIdentifier (string) {
  let segments = string.split('.').map(simpleIdentifier)
  const last = segments.pop()
  return new ast.QualifiedIdentifier(
    new ast.ModuleIdentifier(segments),
    last
  )
}
