'use strict'

const { Transform } = require('stream')

class Liner extends Transform {

  constructor(options = {}) {
    super({ objectMode: true })

    this.delimiter = options.delimiter || undefined

    this.parsed = []
  }

  _transform(chunk, encoding, done) {
    var data = chunk.toString()
    if (this._lastLineData) data = this._lastLineData + data

    const lines = data.split('\n')

    this._lastLineData = lines.splice(lines.length - 1, 1)[0]

    this.__parse(lines)
    this.parsed.forEach(this.push.bind(this))
    this.parsed = []

    done()
  }

  _flush(done) {
    if (this._lastLineData) {
      this.__parse([this._lastLineData])
      this.push(this.parsed[0])
      this.parsed = []
    }
    this._lastLineData = null
    done()
  }

  __parse(lines) {
    lines.forEach(line => {
      const elements = line.split(this.delimiter)
        .map(x => x.replace(' ', ''))
      // console.log(elements);

      // const res = {}
      // elements.map((x, i) => res[i] = x)

      // this.parsed.push(JSON.stringify(res))
      this.parsed.push(elements);
    })
  }
}

module.exports = {
  Liner,
}
