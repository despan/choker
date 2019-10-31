const R = require('ramda')

const delay = require('delay')

const { send } = require('./service')

/*
 * Helpers
 */

/**
 * Send multiple dummy requests
 *
 * @returns {Promise}
 */

const sendMulti = (baseUrl, numbers) => {
  return Promise.all(numbers.map(send(baseUrl)))
}

/**
 * Runner
 *
 * @param {Object} opts
 * @param {number} opts.limit
 * @param {string} opts.baseUrl
 * @param {Array} source
 *
 * @return {Promise}
 */

async function runner (opts, source) {
  const { baseUrl, limit } = opts

  const batches = R.splitEvery(limit, source)
  const results = []

  const add = list => results.push(...list)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]

    const waiting = delay(1000)
    const sending = sendMulti(baseUrl, batch)
      .then(add)

    await Promise.all([sending, waiting])
  }

  return results
}

//

module.exports = runner
