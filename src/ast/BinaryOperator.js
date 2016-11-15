import Operator, { LEFT_TO_RIGHT } from './Operator'
import { DASH } from '../tokens'

/**
 * BinaryOperator ::=
 *   ( DOUBLE_EQUALS
 *   | BEGIN_ANGLE_BRACKET
 *   | END_ANGLE_BRACKET
 *   | REVERSE_FAT_ARROW
 *   | FUNNEL
 *   | AND_KEYWORD
 *   | OR_KEYWORD
 *   | PLUS_SIGN
 *   | DASH
 *   | SLASH
 *   | STAR
 *   | PERCENT_SIGN
 *   | CARET
 *   | PERIOD
 *   | AS_KEYWORD
 *   | IS_KEYWORD
 *   )
 */
export default class BinaryOperator extends Operator {
  get associativity () {
    if (this.token.type === DASH) {
      return LEFT_TO_RIGHT
    }
    return super.associativity
  }

  get precedence () {
    if (this.token.type === DASH) {
      return 3
    }
    return super.precedence
  }
}
