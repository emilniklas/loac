import Lexer from '../../src/Lexer'
import Parser from '../../src/Parser'
import Optimizer from '../../src/Optimizer'
import ErlangGenerator from '../../src/generators/ErlangGenerator'

import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')
const loaDir = resolve(fixturesDir, 'loa')
const erlangDir = resolve(fixturesDir, 'erlang')

const ext = /\.loa$/
const bigLetter = /[A-Z]/g

for (let loaFile of readdirSync(loaDir)) {
  if (!ext.test(loaFile)) {
    continue
  }

  const camelName = loaFile
    .replace(ext, '')

  const testName = camelName
    .replace(bigLetter, (m) => {
      return ' ' + m[0].toLowerCase()
    })
    .trim()

  const loaPath = resolve(loaDir, loaFile)
  const erlangPath = resolve(erlangDir, `${camelName}.erl`)

  const loa = readFileSync(loaPath).toString()
  const erlang = readFileSync(erlangPath).toString()

  test(testName, () => {
    if (loa == null || erlang == null) {
      throw new Error(`${camelName} did not load properly`)
    }

    const clearWhitespace = (s) => s.replace(/\s+/g, '\n').trim()

    expect(
      clearWhitespace(
        ErlangGenerator.emit(
          loaPath,
          Optimizer.optimize(
            Parser.parse(
              Lexer.tokenize(loa)
            )
          )
        )
      )
    ).toEqual(
      clearWhitespace(erlang)
    )
  })
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
