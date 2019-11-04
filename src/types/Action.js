const Daggy = require('daggy')

/*
 *
 */

const Action = Daggy.taggedSum('Action', {
  Backoff: ['time'],
  Run: []
})

//

function fromTimeout (t) {
  return t >= 0
    ? Action.Backoff(t)
    : Action.Run
}

//

module.exports = Action

module.exports.fromTimeout = fromTimeout
