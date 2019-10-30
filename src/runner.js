const R = require('ramda')

const delay = require('delay')

const { sendMulti } = require('./service')

/**
 * Runner
 *
 * @param {Object} opts
 * @param {number} opts.limit
 * @param {string} opts.url
 * @param {Array} source
 *
 * @return {Promise}
 */

function runner (opts, source) {
  const { limit, url } = opts

  const batches = R.splitEvery(limit, source)

  const runNextBatch = () => {
    const arr = batches.pop()

    if (!arr) return Promise.resolve()

    // respect pending ops slightly
    const sending = sendMulti(url, arr)
    const waiting = delay(1000)

    return Promise
      .all([sending, waiting])
      .then(runNextBatch) // recursion
  }

  return runNextBatch()
}

//

module.exports = runner
