import test from 'ava'

import { Action, Request } from '../src/types'

import { actionForBy } from '../src/helpers'

// tests

test('actionForBy', t => {
  t.is(typeof actionForBy, 'function')

  const list = [
    Request.Pending(1),
    Request.Ended(2, 2, 'ok'),
    Request.Ended(3, 3, 'ok'),
    Request.Ended(4, 4, 'ok'),
    Request.Pending(5)
  ]

  const get = (now, limit, interval) =>
    actionForBy(now, { limit, interval }, list)

  t.is(get(6, 6, 3), Action.Send, 'available')

  t.is(get(6, 3, 3), Action.Send, 'some ended long ago')
  t.is(get(6, 3, 4), Action.Send, 'some ended enough ago')

  t.deepEqual(get(6, 3, 5), Action.Backoff(1))
})
