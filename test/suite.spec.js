import test from 'ava'

import R from 'ramda'
import delay from 'delay'

import macros from './macros'

/*
 * Settings
 */

/*
 * Helpers
 */

const itemsN = n => R.range(1, n + 1)

/*
 * Hooks
 */

/*
 * Tests
 */

/*
 * Use marked args in order:
 *
 * - rate
 * - fn
 * - items
 */

test('no item', macros,
  { limit: 5, interval: 20 },
  R.identity,
  []
)

test('single item', macros,
  { limit: 5, interval: 20 },
  R.identity,
  ['1']
)

test('limited items', macros,
  { limit: 5, interval: 20 },
  R.identity,
  itemsN(5)
)

test('many items', macros,
  { limit: 5, interval: 20 },
  R.identity,
  itemsN(50)
)

test('custom fn', macros,
  { limit: 5, interval: 20 },
  x => x * 2,
  itemsN(50)
)

test('fn w/ some delay', macros,
  { limit: 5, interval: 20 },
  x => delay(10).then(() => x),
  itemsN(50)
)

test('fn w/ high delay', macros,
  { limit: 5, interval: 20 },
  x => delay(25).then(() => x),
  itemsN(50)
)
