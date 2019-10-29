const got = require('got')

const G = require('./source')

/*
 * Helpers
 */

const delay = t => {
  const wait = resolve => setTimeout(resolve, t)
  return new Promise(wait)
}

/**
 * Send multiple dummy requests
 *
 * @param {string} url
 * @param {Array} arr
 *
 * @returns {Promise}
 */

const sendMulti = (url, arr) => {
  const ps = arr.map(() => got(url))
  return Promise.all(ps)
}

/**
 * Runner
 *
 * @param {Object} opts
 * @param {number} opts.limit
 * @param {string} opts.url
 * @param {Iterable} source
 *
 * @return {Promise}
 */

function runner (opts, source) {
  const { limit, url } = opts

  const batches = G.batch(limit, source)

  const runNextBatch = () => {
    const arr = batches.next().value

    if (!arr) return Promise.resolve()

    // respect pending ops slightly
    const sending = sendMulti(url, arr)
    const waiting = delay(1000)

    return Promise
      .all([sending, waiting])
      .then(runNextBatch)
  }

  return runNextBatch()
}

//

module.exports = runner
