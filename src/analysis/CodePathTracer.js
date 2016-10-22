import CodePath from './CodePath'
import { IfStatement, ReturnStatement } from '../ast'

export default class CodePathTracer {
  constructor (statements, open = [], completed = [], cursor = 0) {
    this._statements = statements
    this._open = open
    this._completed = completed
    this._cursor = cursor
  }

  static _trace (statements) {
    return new CodePathTracer(
      statements,
      [CodePath.empty]
    )._trace()
  }

  static trace (statements) {
    const traced = CodePathTracer._trace(statements)

    return traced._completed.concat(traced._open)
  }

  _trace () {
    if (this._cursor === this._statements.length) {
      return this
    }

    if (this._current instanceof IfStatement) {
      return this._pushIf()._trace()
    }

    return this._pushNext()._trace()
  }

  get _current () {
    return this._statements[this._cursor]
  }

  _pushNext () {
    return this._push(this._current, 1)
  }

  _push (statement, moves = 0) {
    return this._copy({
      open: this._open.map((path) => {
        return path.push(statement)
      }),
      cursor: this._cursor + moves
    })
  }

  _apply (other) {
    const isReturned = (path) => path.statements
      .filter((s) => s instanceof ReturnStatement)
      .length > 0
    const isNotReturned = (p) => !isReturned(p)

    return this._copy({
      open: this._open
        .concat(other._open.filter(isNotReturned)),
      completed: this._completed
        .concat(other._completed)
        .concat(other._open.filter(isReturned))
    })
  }

  _pushIf () {
    const withCondition = this
      ._push(this._current.expression, 1)

    const inner = new CodePathTracer(
      this._current.body.statements,
      withCondition._open
    )._trace()

    const applied = withCondition
      ._apply(inner)

    return applied
  }

  _copy ({ statements, open, completed, cursor }) {
    return new CodePathTracer(
      statements || this._statements,
      open || this._open,
      completed || this._completed,
      cursor || this._cursor,
    )
  }
}
