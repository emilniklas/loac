import * as t from '../tokens'

export const LEFT_TO_RIGHT = 'LEFT_TO_RIGHT'
export const RIGHT_TO_LEFT = 'RIGHT_TO_LEFT'

/**
 * Base class for BinaryOperator and UnaryOperator
 */
export default class Operator {
  constructor (
    token
  ) {
    this.token = token
  }

  get associativity () {
    switch (this.token.type) {
      case t.DOUBLE_EQUALS:
        return LEFT_TO_RIGHT
      case t.BEGIN_ANGLE_BRACKET:
        return LEFT_TO_RIGHT
      case t.END_ANGLE_BRACKET:
        return LEFT_TO_RIGHT
      case t.REVERSE_FAT_ARROW:
        return LEFT_TO_RIGHT
      case t.FUNNEL:
        return LEFT_TO_RIGHT
      case t.AND_KEYWORD:
        return LEFT_TO_RIGHT
      case t.OR_KEYWORD:
        return LEFT_TO_RIGHT
      case t.NOT_KEYWORD:
        return RIGHT_TO_LEFT
      case t.DASH:
        throw new Error(
          'This operator can either be a subtraction or a negation, ' +
          'please cast it to either a UnaryOperator or a BinaryOperator'
        )
      case t.PLUS_SIGN:
        return LEFT_TO_RIGHT
      case t.SLASH:
        return LEFT_TO_RIGHT
      case t.STAR:
        return LEFT_TO_RIGHT
      case t.PERCENT_SIGN:
        return LEFT_TO_RIGHT
      case t.CARET:
        return LEFT_TO_RIGHT
      case t.PERIOD:
        return LEFT_TO_RIGHT
      case t.WAIT_KEYWORD:
        return RIGHT_TO_LEFT
      case t.AS_KEYWORD:
        return LEFT_TO_RIGHT
      case t.IS_KEYWORD:
        return LEFT_TO_RIGHT
    }
  }

  get precedence () {
    switch (this.token.type) {
      case t.DOUBLE_EQUALS:
        return 2
      case t.BEGIN_ANGLE_BRACKET:
        return 2
      case t.END_ANGLE_BRACKET:
        return 2
      case t.REVERSE_FAT_ARROW:
        return 2
      case t.FUNNEL:
        return 2
      case t.AND_KEYWORD:
        return 0
      case t.OR_KEYWORD:
        return 0
      case t.NOT_KEYWORD:
        return 7
      case t.DASH:
        throw new Error(
          'This operator can either be a subtraction or a negation, ' +
          'please cast it to either a UnaryOperator or a BinaryOperator'
        )
      case t.PLUS_SIGN:
        return 4
      case t.SLASH:
        return 5
      case t.STAR:
        return 5
      case t.PERCENT_SIGN:
        return 5
      case t.CARET:
        return 6
      case t.PERIOD:
        return 10
      case t.WAIT_KEYWORD:
        return 1
      case t.AS_KEYWORD:
        return 3
      case t.IS_KEYWORD:
        return 3
    }
  }

  precedes (other) {
    if (other.precedence < this.precedence) {
      return true
    } else if (other.precedence > this.precedence) {
      return false
    } else if (this.associativity === LEFT_TO_RIGHT) {
      return true
    } else if (this.associativity === RIGHT_TO_LEFT) {
      return false
    } else {
      throw new Error(`${other.token.type} is not a valid operator`)
    }
  }
}
