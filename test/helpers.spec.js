import test from 'ava'

import Backlog from '../src/Backlog'

import { Action, Record } from '../src/types'

import { actionForBy } from '../src/helpers'

// tests

test('actionForBy', t => {
  t.is(typeof actionForBy, 'function')

  const entries = Object.entries({
    a: Record.Pending,
    b: Record.Complete(2, 'ok'),
    c: Record.Complete(3, 'ok'),
    d: Record.Complete(4, 'ok'),
    e: Record.Pending
  })

  const acc = Backlog.from(entries)

  const get = (time, limit, interval) =>
    actionForBy(time, { limit, interval }, acc)

  t.is(get(6, 6, 3), Action.Run, 'available')

  t.is(get(6, 3, 3), Action.Run, 'some ended long ago')
  t.is(get(6, 3, 4), Action.Run, 'some ended enough ago')

  t.deepEqual(get(6, 3, 5), Action.Backoff(1))
})
