const got = require('got')

const delay = require('delay')

const random = require('random-normal')

/**
 * Send a dummy request
 *
 * @returns {Promise}
 */

const send = async (baseUrl, i) => {
  // emulate latency
  const networkTime = random({ mean: 250, dev: 50 })
  await delay(networkTime)

  // actual request code
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
