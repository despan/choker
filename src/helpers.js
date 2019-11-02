const R = require('ramda')

const Backlog = require('./Backlog')

const { Action, Record } = require('./types')

/*
 * Helpers
 */

const earliestTimeFrom = R.compose(
  Record.timeOf,
  R.head,
  Backlog.values
)

/**
 * Get relevant action based on params and situation
 *
 * @param {Date} time
 * @param {Object} rate
 * @param {number} rate.limit
 * @param {number} rate.interval
 * @param {Array} backlog
 *
 * @returns {Action}
 */

function actionForBy (time, rate, backlog) {
  const { limit, interval } = rate

  // has available, short circuit
  if (backlog.size < limit) return Action.Run

  // estimate backoff time
  const timeout = earliestTimeFrom(backlog) + interval - time

  return timeout > 0
    ? Action.Backoff(timeout)
    : Action.Run
}

// expose curried

module.exports.actionForBy = R.curry(actionForBy)
