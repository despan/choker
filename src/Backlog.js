const R = require('ramda')

const { Record } = require('./types')

class Backlog {
  constructor (data) {
    this.data = data || new Map()
  }

  get size () {
    return this.data.size
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

  get (item) {
    return get(item, this)
  }

  put (item, record) {
    return put(item, record, this)
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
  const data = new Map(entries)
  return new Backlog(data)
}

function empty () {
  return new Backlog()
}

/*
 *
 */

function get (item, acc) {
  return acc.data.get(item)
}

function put (item, record, acc) {
  if (!Record.is(record)) {
    throw new RangeError('Value is not Record')
  }

  acc.data.set(item, record)
  return acc
}

function putPending (item, acc) {
  return put(item, Record.Pending, acc)
}

function putPendingInto (acc, item) {
  return putPending(item, acc)
}

function putCompleteNowWith (item, result, acc) {
  const record = Record.Complete(Date.now(), result)
  return put(item, record, acc)
}

function putCompleteNowWithInto (acc, item, result) {
  return putCompleteNowWith(item, result, acc)
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
    Array.from
  )

  return get(acc.data.entries())
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
      const [item, record] = pair
      return pred(record, item)
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
