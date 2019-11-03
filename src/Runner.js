const R = require('ramda')

const delay = require('delay')

const debug = require('debug')('choker:runner')

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

  function actionBy (now) {
    debug('Calculate proper action for %d', now)

    const time = now - interval

    debug('Take recent history since %d', time)

    debug('  from %O', Backlog.values(acc))

    const accRecent = Backlog.filterActiveSince(time, acc)

    debug('(%d entries resolved)', accRecent.size)

    // has available, short circuit
    if (accRecent.size < limit) {
      debug('> Run')
      return Action.Run
    }

    // estimate backoff time
    const timePassed = now - earliestTimeFrom(accRecent)
    debug('Earliest resolved %d ms ago', timePassed)

    const timeout = interval - timePassed

    debug('> Run after %d ms', timeout)

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
    debug('-- Next Iteration --')
    const now = Date.now()

    return R.isEmpty(source)
      ? Promise.resolve()
      : actionBy(now).cata({ Run, Backoff })
  }

  //

  const ps = []

  for (let i; i < limit; i++) {
    ps.push(tryNext())
  }

  return Promise
    .all(ps)
    .then(() => Backlog.entries(acc))
}

// expose curried

module.exports = R.curry(Runner)
