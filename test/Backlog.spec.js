import test from 'ava'

import Backlog from '../src/Backlog'

test('constructor', t => {
  const acc = new Backlog()

  t.true(acc instanceof Backlog)
})

test('getter/setter', t => {
  const acc = new Backlog()

  acc
    .put('a', 1)
    .put('a', 2)
    .put('b', 3)

  t.is(acc.get('a'), 2)
  t.is(acc.get('b'), 3)
})
