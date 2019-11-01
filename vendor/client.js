const R = require('ramda')

const fetch = require('node-fetch')
const createError = require('http-errors')

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

const sendTo = (baseUrl, key) => {
  // actual request code
  const url = `${baseUrl}/hit/${key}`

  return fetch(url)
    .then(recoverFetch)
    .then(() => key)
}

/**
 * Get access log
 *
 * @returns {Promise}
 */

const getServerHistoryFrom = baseUrl => {
  const url = `${baseUrl}/history`

  return fetch(url)
    .then(res => res.json())
}

// expose curried commands

module.exports.sendTo = R.curry(sendTo)
module.exports.getServerHistoryFrom = getServerHistoryFrom
