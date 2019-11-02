import test from 'ava'

import R from 'ramda'

import { Record } from '../src/types'

import Backlog from '../src/Backlog'

const DATA = {
  a: Record.Pending,
  b: Record.Complete(4, 'ok'),
  c: Record.Complete(2, 'ok'),
  d: Record.Pending
}

const ENTRIES = Object.entries(DATA)

test('empty', t => {
  const acc = Backlog.empty()

  t.true(acc instanceof Backlog)
  t.is(acc.size, 0)
})

test('from', t => {
  const acc = Backlog.from(ENTRIES)

  t.true(acc instanceof Backlog)
  t.is(acc.size, 4)
})

//

test('entries', t => {
  const acc = Backlog.from(ENTRIES)

  t.deepEqual(
    acc.entries().map(R.head),
    ['c', 'b', 'a', 'd']
  )
})

test('keys', t => {
  const acc = Backlog.from(ENTRIES)

  t.deepEqual(
    acc.keys(),
    ['c', 'b', 'a', 'd']
  )
})

test('values', t => {
  const acc = Backlog.from(ENTRIES)

  t.deepEqual(
    acc.values(),
    R.props(['c', 'b', 'a', 'd'], DATA)
  )
})

test('put', t => {
  const acc = Backlog.empty()

  t.throws(() => acc.put('a', 1))
  t.notThrows(() => acc.put('a', DATA.a))
})

test('get', t => {
  const acc = Backlog.empty()

  acc.put('a', DATA.a)

  t.is(acc.get('a'), DATA.a)
})

test('filter', t => {
  const acc = Backlog.from(ENTRIES)

  const keysOf = pred => {
    return acc
      .filter(pred)
      .keys()
  }

  t.deepEqual(keysOf(Record.Pending.is), ['a', 'd'])
  t.deepEqual(keysOf(Record.Complete.is), ['c', 'b'])
})

test('filterActiveSince', t => {
  const acc = Backlog.from(ENTRIES)

  const keysOf = t => {
    return acc
      .filterActiveSince(t)
      .keys()
  }

  t.deepEqual(keysOf(0), ['c', 'b', 'a', 'd'])
  t.deepEqual(keysOf(6), ['a', 'd'])

  t.deepEqual(keysOf(3), ['b', 'a', 'd'])
  t.deepEqual(keysOf(4), ['b', 'a', 'd'])
})
