/**
 * Infinite number generator
 *
 * @yields {number}
 */

function * numbers () {
  let x = 1
  while (true) {
    yield x++
  }
}

/**
 * Take initial n elements
 *
 * @param {number} n - limit
 * @param {Iterable} iter - source
 *
 * @yields {number}
 */

function * take (n, iter) {
  if (n < 1) return null

  let i = 0
  for (const x of iter) {
    yield x
    if (++i >= n) {
      break
    }
  }
}

/**
 * Take batches of given length
 *
 * @param {number} n - size of batch
 * @param {Iterable} iter - source
 *
 * @yields {Array<number>}
 */

function * batch (n, iter) {
  let xs = []
  let i = 0

  for (const x of iter) {
    xs[i++] = x
    if (i === n) {
      yield xs
      xs = []
      i = 0
    }
  }

  if (i) yield xs
}

//

module.exports.numbers = numbers
module.exports.batch = batch
module.exports.take = take
