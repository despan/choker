const got = require('got')

/**
 * Send a dummy request
 *
 * @returns {Promise}
 */

const send = (baseUrl, i) => {
  const url = `${baseUrl}/${i}`
  return got(url)
}

/**
 * Send multiple dummy requests
 *
 * @returns {Promise}
 */

const sendMulti = (baseUrl, numbers) => {
  const sendTo = i => send(baseUrl, i)
  return Promise.all(numbers.map(sendTo))
}

//

module.exports = {
  send,
  sendMulti
}
