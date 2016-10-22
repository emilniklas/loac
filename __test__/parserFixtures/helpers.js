import * as ast from '../../src/ast'
import * as t from '../../src/tokens'

export function tok (type, content, [line, char]) {
  return {
    type,
    content,
    location: ['<unknown>', line, char]
  }
}

export function symbol (content, [line, char]) {
  return tok(t.SYMBOL, content, [line, char])
}

export function simpleIdentifier (content, [line, char]) {
  return new ast.SimpleIdentifier(
    symbol(content, [line, char])
  )
}

export function moduleIdentifier (...symbols) {
  return new ast.ModuleIdentifier(
    symbols.map((s) => new ast.SimpleIdentifier(s))
  )
}

export function qualifiedIdentifier (...symbols) {
  const simple = symbols[symbols.length - 1]
  const module = symbols.slice(0, symbols.length - 1)
  return new ast.QualifiedIdentifier(
    moduleIdentifier(...module),
    new ast.SimpleIdentifier(simple)
  )
}
