const R = require('ramda')

const fetch = require('node-fetch')
const createError = require('http-errors')

const delay = require('delay')

const random = require('random-normal')

/**
 *
 */

const recoverFetch = res => {
  if (res.ok) return res

  const err = createError(res.status)
  return Promise.reject(err)
}

/**
 * Send a dummy request
 *
 * @returns {Promise}
 */

const sendTo = async (baseUrl, key) => {
  // emulate latency
  const networkTime = random({ mean: 200, dev: 40 })
  await delay(networkTime)

  // actual request code
  const url = `${baseUrl}/hit/${key}`

  return fetch(url)
    .then(recoverFetch)
    .then(() => key)
}

// expose curried commands

module.exports.sendTo = R.curry(sendTo)
