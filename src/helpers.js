const R = require('ramda')

const { Action, Request } = require('./types')

/**
 * Get relevant action based on params and situation
 *
 * @param {Date} now
 * @param {Object} rate
 * @param {number} rate.limit
 * @param {number} rate.interval
 * @param {Array} requests
 *
 * @returns {Action}
 */

function actionForBy (now, rate, requests) {
  const { limit, interval } = rate

  // has available
  if (requests.length < limit) return Action.Send // short circuit

  // estimate backoff time

  const timesEnded = requests
    .filter(Request.Ended.is)
    .map(Request.timeOf)

  const timePassedMax = now - Math.min(...timesEnded)
  const timeout = interval - timePassedMax

  return timeout > 0
    ? Action.Backoff(timeout)
    : Action.Send
}

// expose curried

module.exports.actionForBy = R.curry(actionForBy)
