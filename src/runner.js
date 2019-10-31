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
 * @param {string} opts.url
 * @param {Array} source
 *
 * @return {Promise}
 */

async function runner (opts, source) {
  const { limit, url } = opts

  const batches = R.splitEvery(limit, source)
  const results = []

  const add = list => results.push(...list)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]

    console.log(batch)
    console.log(Date.now())

    const sending = sendMulti(url, batch).then(add)
    const waiting = delay(1000)

    await Promise.all([sending, waiting])
  }

  return results
}

//

module.exports = runner
