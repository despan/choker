const Daggy = require('daggy')

const R = require('ramda')

const Request = require('./Request')

/*
 *
 */

const Action = Daggy.taggedSum('Action', {
  Backoff: ['time'],
  Send: []
})

/*
 *
 */

function actionForBy (now, rate, list) {
  const { limit, interval } = rate

  // has available
  if (list.length < limit) return Action.Send // short circuit

  // estimate backoff time

  const timesEnded = list
    .filter(Request.Ended.is)
    .map(Request.timeOf)

  const timePassedMax = now - Math.min(...timesEnded)
  const timeout = interval - timePassedMax

  return timeout > 0
    ? Action.Backoff(timeout)
    : Action.Send
}

//

module.exports = Action

module.exports.actionForBy = R.curry(actionForBy)
