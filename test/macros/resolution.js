const R = require('ramda')

const choker = require('../..')

/*
 * Helpers
 */

/**
 * Macro to spy calls and assert log for deviation from limit
 */

async function main (t, rate, fn, items) {
  const res = await choker(rate, fn, items)
  // quick check
  t.is(res.length, items.length, 'corresponding size')

  for (let i = 0; i < res.length; i++) {
    t.deepEqual(res[i], await fn(items[i]), 'match each result')
  }
}

//

module.exports = main

module.exports.title = R.concat('resolution: ')
