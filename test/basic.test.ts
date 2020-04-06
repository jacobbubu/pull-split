import * as fs from 'fs'
import * as pull from 'pull-stream'
import split from '../src'

describe('basic', () => {
  it('simple', (done) => {
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
      split(),
      pull.collect(function (_, array) {
        expect(array.length).toBe(lines.length)
        expect(array).toEqual(lines)
        done()
      })
    )
  })

  it('buffer', (done) => {
    const file = fs.readFileSync(__filename)
    const rawText = file.toString()
    const lines = rawText.split('\n')
    const block = 300
    let i = 0

    const source: pull.Source<Buffer> = (_, cb) => {
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
      split(),
      pull.collect(function (_, array) {
        expect(array.length).toBe(lines.length)
        expect(array).toEqual(lines)
        done()
      })
    )
  })
})
