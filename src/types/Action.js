const Daggy = require('daggy')

/*
 *
 */

const Action = Daggy.taggedSum('Action', {
  Backoff: ['time'],
  Send: []
})

//

module.exports = Action
