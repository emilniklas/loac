import Lexer from '../src/Lexer'
import Parser from '../src/Parser'
import Optimizer from '../src/Optimizer'
import * as ast from '../src/ast'
import * as t from '../src/tokens'

import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'optimizerFixtures')
const optimizedDir = resolve(fixturesDir, 'optimized')
const rawDir = resolve(fixturesDir, 'raw')

const ext = /\.loa$/
const bigLetter = /[A-Z]/g

for (let rawFile of readdirSync(rawDir)) {

  if (!ext.test(rawFile)) {
    continue
  }

  const camelName = rawFile
    .replace(ext, '')

  const testName = camelName
    .replace(bigLetter, (m) => {
      return ' ' + m[0].toLowerCase()
    })

  const rawPath = resolve(rawDir, rawFile)
  const optimizedPath = resolve(optimizedDir, rawFile)

  const raw = readFileSync(rawPath).toString()
  const optimized = readFileSync(optimizedPath).toString()

  test(testName, () => {
    if (raw == null || optimized == null) {
      throw fail(`${camelName} did not load properly`)
    }

    expect(
      removeLocation(Optimizer.optimize(Parser.parse(Lexer.tokenize(raw))))
    ).toEqual(
      removeLocation(Parser.parse(Lexer.tokenize(optimized)))
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
