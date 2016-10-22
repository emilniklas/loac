import CodePathTracer from '../../src/analysis/CodePathTracer'
import CodePath from '../../src/analysis/CodePath'
import Lexer from '../../src/Lexer'
import Parser from '../../src/Parser'

describe('CodePathTracer', () => {
  test('single statement', () => {
    assertPaths(`
      let i = 1
    `, [`
      let i = 1
    `])
  })

  test('two statements', () => {
    assertPaths(`
      let i = 1
      let i2 = 1
    `, [`
      let i = 1
      let i2 = 1
    `])
  })

  test('if statement', () => {
    assertPaths(`
      let i = 1
      if condition {
        let i2 = 1
      }
      let i3 = 1
    `, [`
      let i = 1
      condition
      let i3 = 1
    `, `
      let i = 1
      condition
      let i2 = 1
      let i3 = 1
    `])
  })

  test('return statement', () => {
    // Actor methods allow statements after return
    assertPaths(`
      return 1
      let i = 1
    `, [`
      return 1
      let i = 1
    `])
  })

  test('return statement + if statement', () => {
    assertPaths(`
      if condition {
        return 1
        let i2 = 1
      }
      let i3 = 1
    `, [`
      condition
      return 1
      let i2 = 1
    `, `
      condition
      let i3 = 1
    `])
  })
})

function assertPaths (code, paths) {
  const actual = CodePathTracer.trace(statements(code))
  const expected = paths
    .map(statements)
    .map((p) => new CodePath(p))

  expect(actual).toEqual(expected)
}

function statements (code) {
  const parser = Parser.load(Lexer.tokenize(`{${code}}`))

  return removeLocation(
    parser._parseBlockFunctionBody()
  ).statements
}

function removeLocation (ast) {
  if (typeof ast !== 'object' || ast == null) {
    return ast
  }
  if (ast.constructor === Object && typeof ast.type === 'string') {
    delete ast.location
    return ast
  }
  for (let prop in ast) {
    ast[prop] = removeLocation(ast[prop])
  }
  return ast
}
