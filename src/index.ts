import through, { Emitter } from '@jacobbubu/pull-through'

export type Input = string | Buffer

export type Mapper = (value: string) => any

function split(
  matcher?: string | RegExp | null,
  mapper?: Mapper | null,
  reverse?: boolean | null,
  last?: boolean
) {
  let soFar: string | undefined = ''

  // tslint:disable-next-line strict-type-predicates
  if ('function' === typeof matcher) {
    mapper = matcher
    matcher = null
  }
  if (!matcher) {
    matcher = '\n'
  }

  function map(emitter: Emitter<Input, any>, piece: string) {
    if (mapper) {
      piece = mapper(piece)
      // tslint:disable-next-line strict-type-predicates
      if ('undefined' !== typeof piece) {
        emitter.queue(piece)
      }
    } else {
      emitter.queue(piece)
    }
  }

  return through<Input, any>(
    function (buffer: Input) {
      if (Buffer.isBuffer(buffer)) {
        buffer = buffer.toString()
      }
      const emitter = this
      const pieces = (reverse ? buffer + soFar : soFar + buffer).split(matcher!)

      soFar = reverse ? pieces.shift() : pieces.pop()
      const len = pieces.length
      for (let i = 0; i < len; i++) {
        map(emitter, pieces[reverse ? len - 1 - i : i])
      }
    },
    function () {
      if (last && soFar === undefined) {
        return this.queue(null)
      } else if (soFar !== undefined) {
        // && (last && soFar != ''))
        map(this, soFar)
      }

      this.queue(null)
    }
  )
}

export default split
