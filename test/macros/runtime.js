const R = require('ramda')

const { performance } = require('perf_hooks')

const choker = require('../..')

/*
 * Helpers
 */

/**
 * Macro to spy calls and assert log for deviation from limit
 */

async function main (t, rate, fn, items) {
  const t0 = performance.now()

  await choker(rate, fn, items)

  const timePassed = performance.now() - t0

  const idealTime = items.length > rate.limit
    ? items.length / rate.limit * rate.interval
    : 0

  t.true(timePassed >= idealTime)
}

//

module.exports = main

module.exports.title = R.concat('runtime: ')
