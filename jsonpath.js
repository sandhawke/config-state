// trivial impliementation, to keep it very lightweight
//

export function get (obj, key) {
  if (!key) throw Error('null key')
  if (!obj) return undefined
  if (typeof key === 'string') return get(obj, key.split('.'))
  const k = key[0]
  const value = obj[k]
  if (key.length < 2) return value

  const rest = key.slice(1)
  return get(value, rest)
}

export function set (obj, key, val) {
  if (!key) throw Error('null key')
  if (typeof key === 'string') {
    set(obj, key.split('.'), val)
    return
  }
  let k = key[0]
  if (k === '+') k = obj.length
  if (key.length < 2) {
    obj[k] = val
    return
  }

  let node = obj[k]
  if (node === undefined) {
    node = {}
    obj[k] = node
  }
  if (typeof node === 'string' || typeof node === 'number') {
    throw Error('cannot follow json path into a string or number')
  }
  const rest = key.slice(1)
  set(node, rest, val)
}
