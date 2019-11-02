const Daggy = require('daggy')

const R = require('ramda')

//

const Record = Daggy.taggedSum('Record', {
  Pending: [],
  Complete: ['time', 'result']
})

/**
 *
 */

function lte (b, a) {
  return a.cata({
    Pending: () => b.cata({
      Pending: () => true,
      Complete: () => true
    }),
    Complete: tA => b.cata({
      Pending: () => false,
      Complete: tB => tB < tA
    })
  })
}

/**
 *
 */

function timeOf (record) {
  const throwNoTime = () => {
    throw new TypeError('Can\'t resolve `time` of `Record.Pending`')
  }

  const cases = {
    Pending: throwNoTime,
    Complete: time => time
  }

  return record.cata(cases)
}

/**
 *
 */

function isActiveSince (pointInTime, record) {
  const cases = {
    Pending: () => true,
    Complete: time => time >= pointInTime
  }

  return record.cata(cases)
}

//

module.exports = Record

module.exports.lte = R.curry(lte)

module.exports.timeOf = timeOf

module.exports.isActiveSince = R.curry(isActiveSince)
