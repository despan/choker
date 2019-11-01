const Daggy = require('daggy')

const R = require('ramda')

//

const Request = Daggy.taggedSum('Request', {
  Pending: ['key'],
  Ended: ['key', 'time', 'result']
})

/**
 *
 *
 */

function keyOf (req) {
  const cases = {
    Pending: key => key,
    Ended: key => key
  }

  return req.cata(cases)
}

/**
 *
 */

function timeOf (req) {
  const throwNoTime = () => {
    throw new TypeError('Can\'t resolve `time` of `Request.Pending`')
  }

  const cases = {
    Pending: throwNoTime,
    Ended (_, time) {
      return time
    }
  }

  return req.cata(cases)
}

/**
 *
 */

function isActiveSince (pointInTime, req) {
  const cases = {
    Pending: () => true,
    Ended: (_, time) => time >= pointInTime
  }

  return req.cata(cases)
}

//

module.exports = Request

module.exports.keyOf = keyOf
module.exports.timeOf = timeOf

module.exports.isActiveSince = R.curry(isActiveSince)
