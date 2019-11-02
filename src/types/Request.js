const Daggy = require('daggy')

const R = require('ramda')

//

const Request = Daggy.taggedSum('Request', {
  Pending: [],
  Ended: ['time', 'result']
})

/**
 *
 */

function timeOf (req) {
  const throwNoTime = () => {
    throw new TypeError('Can\'t resolve `time` of `Request.Pending`')
  }

  const cases = {
    Pending: throwNoTime,
    Ended: time => time
  }

  return req.cata(cases)
}

/**
 *
 */

function isActiveSince (pointInTime, req) {
  const cases = {
    Pending: () => true,
    Ended: time => time >= pointInTime
  }

  return req.cata(cases)
}

//

module.exports = Request

module.exports.timeOf = timeOf

module.exports.isActiveSince = R.curry(isActiveSince)
