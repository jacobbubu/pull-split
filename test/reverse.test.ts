import * as fs from 'fs'
import * as pull from 'pull-stream'
import split from '../src'

describe('reverse', () => {
  it('read this file', (done) => {
    const file = fs.readFileSync(__filename).toString()
    const lines = file.split('\n').reverse()
    const block = 300
    let i = file.length

    const source: pull.Source<string> = (_, cb) => {
      if (i <= 0) {
        cb(true)
      } else {
        let _i = i
        i -= block
        _i = Math.max(_i, 0)
        const line = file.slice(Math.max(_i - block, 0), _i)
        cb(null, line)
      }
    }
    pull(
      source,
      split('\n', null, true),
      pull.collect(function (_, array) {
        expect(array.length).toBe(lines.length)
        expect(array).toEqual(lines)
        done()
      })
    )
  })
})
