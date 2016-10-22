/**
 * TypeArguments ::=
 *   BEGIN_ANGLE_BRACKET
 *   (TypeArgument COMMA?)+
 *   END_ANGLE_BRACKET
 */
export default class TypeArguments {
  constructor (
    beginBracket,
    typeArguments,
    endBracket
  ) {
    this.beginBracket = beginBracket
    this.typeArguments = typeArguments
    this.endBracket = endBracket
  }
}
