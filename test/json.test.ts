import * as fs from 'fs'
import * as pull from 'pull-stream'
import split from '../src'

describe('json', () => {
  const input = [1, 2, { okay: true }, 'whatever']

  it('split into json lines', (done) => {
    pull(
      pull.values([input.map((x) => JSON.stringify(x)).join('\n')]),
      split(null, JSON.parse),
      pull.collect(function (err, ary) {
        expect(err).toBeFalsy()
        expect(ary).toEqual(input)
        done()
      })
    )
  })

  it('split into json lines2', (done) => {
    pull(
      pull.values([input.map((d) => JSON.stringify(d, null, 2)).join('\n\n')]),
      split('\n\n', JSON.parse),
      pull.collect(function (err, ary) {
        expect(err).toBeFalsy()
        expect(ary).toEqual(input)
        done()
      })
    )
  })

  it('split into json lines3', (done) => {
    pull(
      pull.values([input.map((d) => JSON.stringify(d, null, 2) + '\n').join('\n')]),
      split('\n\n', JSON.parse),
      pull.collect(function (err, ary) {
        expect(err).toBeFalsy()
        expect(ary).toEqual(input)
        done()
      })
    )
  })
})
