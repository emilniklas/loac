import * as t from './tokens'
import * as ast from './ast'

function token (type, content) {
  return {
    type, content,
    location: ['<unknown>', NaN, NaN]
  }
}

export function symbol (content) {
  return token(t.SYMBOL, content)
}

export const RETURN_KEYWORD =
  token(t.RETURN_KEYWORD, 'return')
export const BEGIN_CURLY_BRACE =
  token(t.BEGIN_CURLY_BRACE, '{')
export const END_CURLY_BRACE =
  token(t.END_CURLY_BRACE, '}')
export const BEGIN_ANGLE_BRACKET =
  token(t.BEGIN_ANGLE_BRACKET, '<')
export const END_ANGLE_BRACKET =
  token(t.END_ANGLE_BRACKET, '>')
export const ARROW =
  token(t.ARROW, '->')

export function integer (number) {
  return token(t.INTEGER_LITERAL, String(number))
}

export function returnStatement (expression) {
  return new ast.ReturnStatement(
    RETURN_KEYWORD,
    expression
  )
}

export function typeReference (name) {
  return new ast.TypeReference(
    new ast.SimpleIdentifier(
      symbol(name)
    )
  )
}