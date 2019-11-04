import test from 'ava'

import choker from '..'

/*
 * Settings
 */

const RATE = {
  limit: 2,
  interval: 10
}

const FN = x => Promise.resolve(x * 2)

const ITEMS = [1, 2, 3, 4, 5]

/*
 * Tests
 */

test('signature', t => {
  t.is(typeof choker, 'function')

  const ret = choker(RATE, FN, ITEMS)
  t.is(typeof ret, 'object')
  t.is(typeof ret.then, 'function', 'returns promise')
})

test('signature (curried)', t => {
  t.is(typeof choker(RATE), 'function', '1 of 3')
  t.is(typeof choker(RATE)(FN), 'function', '1 + 1 of 3')
  t.is(typeof choker(RATE)(FN)(ITEMS), 'object', '1 + 1 + 1 of 3')

  t.is(typeof choker(RATE, FN), 'function', '2 of 3')
  t.is(typeof choker(RATE, FN)(ITEMS), 'object', '2 + 1 of 3')
})

test('results', async t => {
  const res = await choker(RATE, FN, ITEMS)

  t.true(Array.isArray(res))
  t.is(res.length, ITEMS.length)

  res.forEach(async row => {
    t.true(Array.isArray(row), 'each row is pair')
    t.is(row.length, 2, 'each row is pair')

    const [item, { time, result }] = row

    t.true(ITEMS.includes(item))

    t.not(time, undefined)
    t.deepEqual(result, await FN(item))
  })
})
