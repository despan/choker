const Debug = require('debug')

const R = require('ramda')

const delay = require('delay')

const Backlog = require('./Backlog')

const { actionForBy } = require('./helpers')

/*
 * Settings
 */

const debug = Debug('sfc:runner')

/*
 * Helpers
 */

/**
 * Runner
 *
 * @param {Object} rate
 * @param {number} rate.limit
 * @param {number} rate.interval
 * @param {Function} fn
 * @param {Array} source
 *
 * @return {Promise}
 */

async function Runner (rate, fn, input) {
  const { limit, interval } = rate

  //
  const source = input.slice(0) // clone

  // results accumulator
  const acc = Backlog.empty()

  const putPending = Backlog.putPendingInto(acc)
  const putCompleteWith = Backlog.putCompleteNowWithInto(acc)
  //

  const Run = () => {
    const item = source.shift()

    putPending(item)

    return fn(item)
      .then(putCompleteWith(item))
      .then(tryNext)
  }

  const Backoff = time => {
    debug('Retry after %d ms', time)
    return delay(time)
      .then(tryNext)
  }

  //

  function tryNext () {
    // short circuit
    if (R.isEmpty(source)) return Promise.resolve()

    //
    const now = Date.now()

    const accRecent = Backlog.filterActiveSince(now - interval, acc)

    return actionForBy(now, rate, accRecent)
      .cata({ Run, Backoff })
  }

  const ps = Array
    .from({ length: limit })
    .map(tryNext)

  return Promise
    .all(ps)
    .then(() => Backlog.entries(acc))
}

// expose curried

module.exports = R.curry(Runner)
