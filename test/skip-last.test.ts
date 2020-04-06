import * as fs from 'fs'
import * as pull from 'pull-stream'
import split from '../src'

describe('skip-last', () => {
  it('read this file', (done) => {
    const file = fs.readFileSync(__filename).toString()
    const lines = file.split('\n')
    const block = 300
    let i = 0

    const source: pull.Source<string> = (_, cb) => {
      if (i > file.length) {
        cb(true)
      } else {
        const _i = i
        i += block
        cb(null, file.slice(_i, _i + block))
      }
    }
    pull(
      source,
      split(null, null, null, true),
      pull.collect(function (_, array) {
        expect(array.length).toBe(lines.length)
        expect(array).toEqual(lines)
        done()
      })
    )
  })
})
