/**
 * SimpleIdentifier ::=
 *   SYMBOL
 */
export default class SimpleIdentifer {
  constructor (
    symbol
  ) {
    this.symbol = symbol
  }

  get begin () {
    return this.symbol
  }

  get end () {
    return this.symbol
  }
}
