const Debug = require('debug')

const R = require('ramda')

const delay = require('delay')

const { Request } = require('./types')

const { actionForBy } = require('./helpers')

const { sendTo } = require('../vendor')

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

  const send = sendTo(baseUrl)

  //
  const source = input.slice(0) // clone
  // results accumulator
  const acc = []

  const runThread = async name => {
    const debug = Debug(`sfc:runner:thread:${name}`)

    debug('Started thread')

    const runOne = async () => {
      // short circuit
      if (source.length === 0) {
        debug('Exhausted')
        return Promise.resolve()
      }

      //

      const now = Date.now()

      const isActive = Request.isActiveSince(now - interval)
      const activeItems = acc.filter(isActive)

      debug('Found %d active items', activeItems.length)

      const Send = () => {
        // run
        const key = source.shift()
        debug('Run for key %s', key)

        // TODO: use key-value store for `acc`
        const idx = acc.length
        acc[idx] = Request.Pending(key)

        return send(key)
          .then(res => {
            acc[idx] = Request.Ended(key, Date.now(), res)
          })
          // .catch(err => {
          //   acc[idx] = Request.Ended(key, Date.now(), err)
          // })
          .then(runOne)
      }

      const Backoff = time => {
        debug('Retry after %d ms', time)
        return delay(time)
          .then(runOne)
      }

      return actionForBy(now, rate, activeItems)
        .cata({ Send, Backoff })
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
