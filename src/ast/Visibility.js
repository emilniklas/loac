/**
 * Visibility ::=
 *   PRIVATE_KEYWORD |
 *   PUBLIC_KEYWORD
 */
export default class Visibility {
  constructor (
    keyword
  ) {
    this.keyword = keyword
  }

  get begin () {
    return this.keyword
  }

  get end () {
    return this.keyword
  }
}
