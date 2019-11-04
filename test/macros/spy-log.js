const R = require('ramda')

const debug = require('debug')('choker:test')

const choker = require('../..')

/*
 * Helpers
 */

/**
 * Validate log for given rate
 */

const isValidBy = (rate, log) => {
  const { limit, interval } = rate

  const winFor = (acc, next) => {
    const isIncluded = R.lte(next - interval)
    const list = R.takeLastWhile(isIncluded, acc)

    return R.append(next, list)
  }

  const windows = R.scan(winFor, [], log)

  let win
  while (win = windows.shift()) { // eslint-disable-line
    if (win.length > limit) {
      debug('Window log exceeds limit of', limit)
      debug('Window log:', win)
      return false
    }
  }

  return true
}

/**
 * Macro to spy calls and assert log for deviation from limit
 */

async function main (t, rate, fn, items) {
  const acc = []

  const log = () => acc.push(Date.now())

  const spy = item => {
    return Promise
      .resolve(item)
      .then(fn)
      .then(R.tap(log))
  }

  await choker(rate, spy, items)

  t.true(isValidBy(rate, acc))
}

//

module.exports = main

module.exports.title = R.concat('spy log: ')
