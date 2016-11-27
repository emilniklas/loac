import Lexer from '../src/Lexer'
import Parser from '../src/Parser'
import Optimizer from '../src/Optimizer'
import MessageAggregator from '../src/MessageAggregator'
import BasicReporter from '../src/reporting/BasicReporter'

import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

const fixturesDir = resolve(__dirname, 'optimizerFixtures')
const optimizedDir = resolve(fixturesDir, 'optimized')
const rawDir = resolve(fixturesDir, 'raw')
const messagesDir = resolve(fixturesDir, 'messages')

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
  const messagesPath = resolve(messagesDir, rawFile.replace(/\.loa$/, '.log'))

  const raw = readFileSync(rawPath).toString()
  const optimized = readFileSync(optimizedPath).toString()
  const messages = existsSync(messagesPath)
    ? readFileSync(messagesPath).toString()
    : ''
  const trimPath = (path) =>
    path.replace(dirname(__dirname) + '/', '')
  const trimmedRawPath = trimPath(rawPath)

  test(testName, () => {
    if (raw == null || optimized == null) {
      throw new Error(`${camelName} did not load properly`)
    }

    const aggregator = new MessageAggregator()

    const optimizedAst = Optimizer.optimize(
      trimmedRawPath,
      raw,
      Parser.parse(trimmedRawPath, raw, Lexer.tokenize(raw)),
      aggregator
    )

    const rawAst = Parser.parse(
      trimmedRawPath,
      raw,
      Lexer.tokenize(optimized)
    )

    expect(removeLocation(optimizedAst))
      .toEqual(removeLocation(rawAst))

    expect(
      BasicReporter.report(aggregator.messages).join('\n').trim()
    ).toBe(messages.trim())
  })
}

function removeLocation (ast) {
  if (typeof ast !== 'object' || ast == null) {
    return ast
  }
  if (ast.constructor === Object && typeof ast.type === 'string') {
    const copy = Object.assign({}, ast)
    delete copy.location
    return copy
  }
  let copy = {}
  for (let prop in ast) {
    copy[prop] = removeLocation(ast[prop])
  }
  return copy
}
