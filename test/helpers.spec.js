import test from 'ava'

import H from '../src/helpers'

test('isActiveAt', t => {
  const records = [
    H.pending(1),
    H.resolved(2, 2),
    H.rejected(3, 3),
    H.pending(4),
    H.resolved(5, 5),
    H.rejected(6, 6)
  ]

  const since = t => {
    const isActive = H.isActiveSince(t)
    return records
      .filter(isActive)
      .map(r => r.key)
  }

  t.deepEqual(since(7), [1, 4], 'out time -> only pending')

  t.deepEqual(since(6), [1, 4, 6], 'pending + range')
  t.deepEqual(since(5), [1, 4, 5, 6])
})

test('earliestDoneAt', t => {
  const records = [
    H.pending(1),
    H.resolved(2, 2),
    H.rejected(3, 3),
    H.pending(4),
    H.resolved(5, 5),
    H.rejected(6, 6)
  ]

  t.is(H.earliestDoneAt(records), 2)
})
