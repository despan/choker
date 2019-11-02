const Daggy = require('daggy')

/*
 *
 */

const Action = Daggy.taggedSum('Action', {
  Backoff: ['time'],
  Run: []
})

//

module.exports = Action
