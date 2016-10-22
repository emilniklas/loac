export function deepEquals (a, b) {
  if (a == null || b == null) {
    return a == b
  }

  if (typeof a !== 'object') {
    return a === b
  }

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false
  }

  if (Array.isArray(a)) {
    return a.length === b.length
        && a.reduce(
          (success, _, index) => success && deepEquals(a[index], b[index]),
          true
        )
  }

  if (!deepEquals(Object.keys(a), Object.keys(b))) {
    return false
  }

  for (let prop in a) {
    // Special case: in a plain object, a 'location' prop is ignored in comparison
    if (prop === 'location' && a.constructor === Object) {
      continue
    }

    if (a.hasOwnProperty(prop) && !deepEquals(a[prop], b[prop])) {
      return false
    }
  }

  return true
}
