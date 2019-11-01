const Debug = require('debug')

const R = require('ramda')

const delay = require('delay')

const Service = require('./service')

const H = require('./helpers')

/*
 * Settings
 */

/*
 * Helpers
 */

/**
 * Runner
 *
 * @param {string} baseUrl
 * @param {Object} rate
 * @param {number} rate.limit
 * @param {number} rate.interval
 * @param {Array} source
 *
 * @return {Promise}
 */

async function runner (baseUrl, rate, input) {
  const { limit, interval } = rate

  const send = Service.send(baseUrl)

  //
  const source = input.slice(0) // clone
  // results accumulator
  const acc = []

  const runThread = async name => {
    const debug = Debug(`sfc:runner:thread:${name}`)

    debug('Started thread')

    const runOne = async () => {
      const now = Date.now()
      const winStart = now - interval

      const activeItems = acc.filter(H.isActiveSince(winStart))

      debug('Found %d active items', activeItems.length)

      if (activeItems.length >= limit) {
        const winEarliest = H.earliestDoneAt(activeItems)
        const timeAgo = now - winEarliest

        debug('Earliest active item completed %d ms ago', timeAgo)

        const timeToWait = Math.max(interval - timeAgo, 0)

        debug('Retry after %d ms', timeToWait)

        return delay(timeToWait)
          .then(runOne)
      }

      // short circuit
      if (source.length === 0) {
        return Promise.resolve()
      }

      // run
      const key = source.shift()
      debug('Run for key %s', key)

      const idx = acc.length
      acc[idx] = H.pending(key)

      return send(key)
        .then(() => {
          acc[idx] = H.resolved(key, Date.now())
        })
        // .catch(() => {
        //   acc[idx] = H.rejected(key, Date.now())
        // })
        .then(runOne)
    }

    return runOne()
      .then(() => debug('Exhausted'))
  }

  const ps = []

  for (let i = 0; i < limit; i++) {
    ps.push(runThread(i))
  }

  return Promise
    .all(ps)
    .then(() => acc)
}

// expose curried

module.exports = R.curry(runner)
