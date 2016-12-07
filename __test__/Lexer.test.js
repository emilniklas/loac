import {
  EOF,
  WHITESPACE,

  MODULE_KEYWORD,
  USE_KEYWORD,
  STRUCT_KEYWORD,
  CLASS_KEYWORD,
  ACTOR_KEYWORD,
  PRIVATE_KEYWORD,
  PUBLIC_KEYWORD,
  DELEGATE_KEYWORD,

  SYMBOL
} from '../src/tokens'
import Lexer from '../src/Lexer'

test('empty string gives empty list', () => {
  expect(
    Lexer.tokenize('')
  ).toEqual([{
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 0]
  }])
})

test('whitespace token', () => {
  expect(
    Lexer.tokenize(' ')
  ).toEqual([{
    type: WHITESPACE,
    content: ' ',
    location: ['<unknown>', 1, 0]
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 1]
  }])
})

test('multiple whitespace tokens', () => {
  expect(
    Lexer.tokenize(' \t')
  ).toEqual([{
    type: WHITESPACE,
    content: ' \t',
    location: ['<unknown>', 1, 0]
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 2]
  }])
})

test('keywords', () => {
  expect(
    Lexer.tokenize(
      'module use struct class ' +
      'actor private public delegate'
    )
  ).toEqual([{
    content: 'module',
    location: ['<unknown>', 1, 0],
    type: MODULE_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 6],
    type: WHITESPACE
  }, {
    content: 'use',
    location: ['<unknown>', 1, 7],
    type: USE_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 10],
    type: WHITESPACE
  }, {
    content: 'struct',
    location: ['<unknown>', 1, 11],
    type: STRUCT_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 17],
    type: WHITESPACE
  }, {
    content: 'class',
    location: ['<unknown>', 1, 18],
    type: CLASS_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 23],
    type: WHITESPACE
  }, {
    content: 'actor',
    location: ['<unknown>', 1, 24],
    type: ACTOR_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 29],
    type: WHITESPACE
  }, {
    content: 'private',
    location: ['<unknown>', 1, 30],
    type: PRIVATE_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 37],
    type: WHITESPACE
  }, {
    content: 'public',
    location: ['<unknown>', 1, 38],
    type: PUBLIC_KEYWORD
  }, {
    content: ' ',
    location: ['<unknown>', 1, 44],
    type: WHITESPACE
  }, {
    content: 'delegate',
    location: ['<unknown>', 1, 45],
    type: DELEGATE_KEYWORD
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 53]
  }])
})

test('symbols', () => {
  expect(
    Lexer.tokenize('x')
  ).toEqual([{
    content: 'x',
    location: ['<unknown>', 1, 0],
    type: SYMBOL
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 1]
  }])

  expect(
    Lexer.tokenize('abc')
  ).toEqual([{
    content: 'abc',
    location: ['<unknown>', 1, 0],
    type: SYMBOL
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 3]
  }])

  expect(
    Lexer.tokenize('_abc')
  ).toEqual([{
    content: '_abc',
    location: ['<unknown>', 1, 0],
    type: SYMBOL
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 4]
  }])

  expect(
    Lexer.tokenize('_2a_B3c')
  ).toEqual([{
    content: '_2a_B3c',
    location: ['<unknown>', 1, 0],
    type: SYMBOL
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 7]
  }])

  expect(
    Lexer.tokenize("_2a_B3c'''")
  ).toEqual([{
    content: "_2a_B3c'''",
    location: ['<unknown>', 1, 0],
    type: SYMBOL
  }, {
    type: EOF,
    content: '',
    location: ['<unknown>', 1, 10]
  }])
})
