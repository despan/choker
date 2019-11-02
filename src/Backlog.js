const R = require('ramda')

const { Record } = require('./types')

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
    return get(key, this)
  }

  put (key, value) {
    return put(key, value, this)
  }

  filter (pred) {
    return filter(pred, this)
  }

  filterActiveSince (time) {
    return filterActiveSince(time, this)
  }
}

/**
 *
 */

function from (entries) {
  const data = R.fromPairs(entries)
  return new Backlog(data)
}

function empty () {
  return new Backlog({})
}

/*
 *
 */

function get (key, acc) {
  return acc.data[key]
}

function put (key, value, acc) {
  if (!Record.is(value)) {
    throw new RangeError('Value is not Record')
  }

  acc.data[key] = value
  return acc
}

function putPending (key, acc) {
  return put(key, Record.Pending, acc)
}

function putPendingInto (acc, key) {
  return putPending(key, acc)
}

function putCompleteNowWith (key, result, acc) {
  const record = Record.Complete(Date.now(), result)
  return put(key, record, acc)
}

function putCompleteNowWithInto (acc, key, result) {
  return putCompleteNowWith(key, result, acc)
}

/**
 *
 */

function entries (acc) {
  const byTime = (A, B) => {
    return Record.lte(B[1], A[1]) ? 1 : -1
  }

  const get = R.compose(
    R.sort(byTime),
    R.toPairs
  )

  return get(acc.data)
}

function keys (acc) {
  const get = R.compose(
    R.map(R.head),
    entries
  )

  return get(acc)
}

function values (acc) {
  const get = R.compose(
    R.map(R.last),
    entries
  )

  return get(acc)
}

/**
 *
 */

function filter (pred, acc) {
  const get = R.compose(
    from,
    R.filter(pair => {
      const [key, value] = pair
      return pred(value, key)
    }),
    entries
  )

  return get(acc)
}

function filterActiveSince (time, acc) {
  return filter(Record.isActiveSince(time), acc)
}

//

module.exports = Backlog

module.exports.from = from
module.exports.empty = empty

module.exports.entries = entries
module.exports.keys = keys
module.exports.values = values

module.exports.get = get
module.exports.put = R.curry(put)
module.exports.putPending = R.curry(putPending)
module.exports.putPendingInto = R.curry(putPendingInto)
module.exports.putCompleteNowWith = R.curry(putCompleteNowWith)
module.exports.putCompleteNowWithInto = R.curry(putCompleteNowWithInto)

module.exports.filter = R.curry(filter)
module.exports.filterActiveSince = R.curry(filterActiveSince)
