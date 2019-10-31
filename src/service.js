const R = require('ramda')

const got = require('got')

const delay = require('delay')

const random = require('random-normal')

/**
 * Send a dummy request
 *
 * @returns {Promise}
 */

const send = async (baseUrl, key) => {
  // emulate latency
  const networkTime = random({ mean: 250, dev: 50 })
  await delay(networkTime)

  // actual request code
  const url = `${baseUrl}/${key}`

  return got(url)
    .then(() => key)
}

// expose curried commands

module.exports.send = R.curry(send)
