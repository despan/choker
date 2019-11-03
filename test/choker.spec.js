import test from 'ava'

import Debug from 'debug'

import R from 'ramda'

import delay from 'delay'

import choker from '../src/Runner'

// debug

const debug = Debug('choker:test')

/*
 * Settings
 */

const RATE = {
  limit: 2,
  interval: 50
}

/*
 * Helpers
 */

//
const isValidBy = rate => log => {
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

/*
 * Hooks
 */

/*
 * Tests
 */

test('isValidBy', t => {
  const isValid = isValidBy({ limit: 2, interval: 10 })

  t.true(isValid([1]))

  t.true(isValid([1, 1]))

  t.false(isValid([1, 1, 1]))
  t.false(isValid([1, 1, 10]))
  t.false(isValid([1, 1, 11]))
  t.true(isValid([1, 1, 12]))

  t.true(isValid([1, 1, 12, 12, 23, 23]))
  t.true(isValid([1, 6, 12, 17, 23, 28]))
})

test.failing('zero delay', async t => {
  const length = 20

  const log = []

  const fn = async () => {
    log.push(Date.now())
  }

  const arr = Array.from({ length })

  await choker(RATE, fn, arr)

  t.true(isValidBy(RATE)(log))
})

test.failing('some delay', async t => {
  const length = 20

  const log = []

  const fn = async () => {
    log.push(Date.now())
    return delay(RATE.interval / RATE.limit)
  }

  const arr = Array.from({ length })

  await choker(RATE, fn, arr)

  t.true(isValidBy(RATE)(log))
})
