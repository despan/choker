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
 * @param {Function} fn
 * @param {Object} rate
 * @param {number} rate.limit
 * @param {number} rate.interval
 * @param {Array} source
 *
 * @return {Promise}
 */

async function runner (fn, rate, input) {
  const { limit, interval } = rate

  //
  const source = input.slice(0) // clone

  // results accumulator
  const acc = Backlog.empty()

  const putPending = Backlog.putPendingInto(acc)
  const putCompleteWith = Backlog.putCompleteNowWithInto(acc)
  //

  const Run = () => {
    const key = source.shift()
    debug('Run for key %s', key)

    putPending(key)

    return fn(key)
      .then(putCompleteWith(key))
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

    const accRecent = acc.filterActiveSince(now - interval)

    return actionForBy(now, rate, accRecent)
      .cata({ Run, Backoff })
  }

  const ps = Array
    .from({ length: limit })
    .map(tryNext)

  return Promise
    .all(ps)
    .then(() => Backlog.values(acc))
}

// expose curried

module.exports = R.curry(runner)
