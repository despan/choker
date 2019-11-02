const R = require('ramda')

const delay = require('delay')

const Backlog = require('./Backlog')

const { Action, Record } = require('./types')

/*
 * Settings
 */

/*
 * Helpers
 */

const earliestTimeFrom = R.compose(
  Record.timeOf,
  R.head,
  Backlog.values
)

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

  function actionBy (time) {
    const accRecent = Backlog.filterActiveSince(time, acc)

    // has available, short circuit
    if (accRecent.size < limit) return Action.Run

    // estimate backoff time
    const timeout = earliestTimeFrom(accRecent) - time

    return timeout > 0
      ? Action.Backoff(timeout)
      : Action.Run
  }

  //

  const Run = () => {
    const item = source.shift()

    putPending(item)

    return fn(item)
      .then(putCompleteWith(item))
      .then(tryNext)
  }

  const Backoff = time => {
    return delay(time)
      .then(tryNext)
  }

  //

  function tryNext () {
    const timeAgo = () => Date.now() - interval

    return R.isEmpty(source)
      ? Promise.resolve()
      : actionBy(timeAgo()).cata({ Run, Backoff })
  }

  //

  const ps = Array
    .from({ length: limit })
    .map(tryNext)

  return Promise
    .all(ps)
    .then(() => Backlog.entries(acc))
}

// expose curried

module.exports = R.curry(Runner)
