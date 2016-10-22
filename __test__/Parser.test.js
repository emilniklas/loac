import Lexer from '../src/Lexer'
import Parser from '../src/Parser'
import * as ast from '../src/ast'
import * as t from '../src/tokens'

import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

const fixturesDir = resolve(__dirname, 'parserFixtures')
const codeDir = resolve(fixturesDir, 'code')
const astDir = resolve(fixturesDir, 'ast')

const ext = /\.loa$/
const bigLetter = /[A-Z]/g

for (let codeFile of readdirSync(codeDir)) {

  if (!ext.test(codeFile)) {
    continue
  }

  const camelName = codeFile
    .replace(ext, '')

  const testName = camelName
    .replace(bigLetter, (m) => {
      return ' ' + m[0].toLowerCase()
    })

  const codePath = resolve(codeDir, codeFile)
  const astPath = resolve(astDir, camelName + '.js')

  const code = readFileSync(codePath).toString()
  const ast = require(astPath).default

  test(testName, () => {
    if (code == null || ast == null) {
      throw fail(`${camelName} did not load properly`)
    }

    expect(Parser.parse(Lexer.tokenize(code)))
      .toEqual(ast)
  })
}
