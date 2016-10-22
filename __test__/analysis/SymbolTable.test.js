import SymbolTable, { DuplicateSymbolError } from '../../src/analysis/SymbolTable'

describe('SymbolTable', () => {
  const table = SymbolTable.make()

  test('it contains a hash table of symbols', () => {
    expect(table.has('x')).toBe(false)
    expect(table.set('x').has('x')).toBe(true)
    expect(table.get('x')).toEqual(null)
    expect(table.set('x').get('x')).toEqual({
      symbol: 'x',
      type: undefined,
      value: undefined
    })
  })

  test('it cannot set the same symbol twice', () => {
    expect(() => table.set('x').set('x')).toThrow(DuplicateSymbolError)
  })

  test('it can set the type and value of the symbol', () => {
    expect(table.set('x', {
      type: 1,
      value: 2
    }).get('x')).toEqual({
      symbol: 'x',
      type: 1,
      value: 2
    })
  })
})
