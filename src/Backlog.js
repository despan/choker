const R = require('ramda')

class Backlog {
  constructor (data) {
    this.data = data || {}
  }

  get size () {
    return R.keys(this.data).length
  }

  entries () {
    return entries(this)
  }

  keys () {
    return keys(this)
  }

  values () {
    return values(this)
  }

  get (key) {
    return this.data[key]
  }

  put (key, value) {
    this.data[key] = value
    return this
  }

  filter (pred) {
    return filter(pred, this)
  }

  static empty () {
    return new Backlog({})
  }

  static from (entires) {
    const data = R.fromPairs(entires)
    return new Backlog(data)
  }
}

/*
 *
 */

function entries (acc) {
  return R.toPairs(acc.data)
}

function keys (acc) {
  return R.keys(acc.data)
}

function values (acc) {
  return R.values(acc.data)
}

function filter (pred, acc) {
  const data = R.filter(pred, acc.data)
  return new Backlog(data)
}

//

module.exports = Backlog

module.exports.entries = entries
module.exports.keys = keys
module.exports.values = values

module.exports.filter = R.curry(filter)
