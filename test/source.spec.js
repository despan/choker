import test from 'ava'

import { numbers, take, batch } from '../src/source'

/*
 * Helpers
 */

const nextOf = iter => iter.next().value

/*
 * Tests
 */

test('numbers', t => {
  const source = numbers()

  t.is(nextOf(source), 1)
  t.is(nextOf(source), 2)
  t.is(nextOf(source), 3)
})

test('take', t => {
  const source = take(3, numbers())

  t.is(nextOf(source), 1)
  t.is(nextOf(source), 2)
  t.is(nextOf(source), 3)
  t.is(nextOf(source), undefined)
})

test('batch', t => {
  const source = batch(3, numbers())

  t.deepEqual(nextOf(source), [1, 2, 3])
  t.deepEqual(nextOf(source), [4, 5, 6])
})
