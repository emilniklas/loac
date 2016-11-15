import Operator, { RIGHT_TO_LEFT } from './Operator'
import { DASH } from '../tokens'

/**
 * UnaryOperator ::=
 *   ( NOT_KEYWORD
 *   | DASH
 *   | WAIT_KEYWORD
 *   )
 */
export default class UnaryOperator extends Operator {
  get associativity () {
    if (this.token.type === DASH) {
      return RIGHT_TO_LEFT
    }
    return super.associativity
  }

  get precedence () {
    if (this.token.type === DASH) {
      return 7
    }
    return super.precedence
  }
}
