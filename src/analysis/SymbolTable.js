export class DuplicateSymbolError extends Error {
  constructor (symbol) {
    super(`"${symbol}" is defined more than once.`)
  }
}

export default class SymbolTable {
  constructor (symbols) {
    this.symbols = symbols
  }

  static make (obj = {}) {
    return new SymbolTable(Object.keys(obj).map((k) => ({
      symbol: k,
      type: obj[k].type,
      value: obj[k].value
    })))
  }

  set (symbol, { type, value } = {}) {
    if (this.has(symbol)) {
      throw new DuplicateSymbolError(symbol)
    }
    return new SymbolTable(
      this.symbols.concat({
        symbol, type, value
      })
    )
  }

  has (symbol) {
    return this.symbols.reduce(
      (success, reg) => success || symbol == reg.symbol,
      false
    )
  }

  get (symbol) {
    return this.symbols.reduce(
      (result, reg) => {
        if (reg.symbol === symbol) {
          return result || reg
        }
        return result
      },
      null
    )
  }
}
