// several options for linebyline reading,
// see: https://geshan.com.np/blog/2021/10/nodejs-read-file-line-by-line/
// I decided to go with https://github.com/nacholibre/node-readlines
import LineByLine from 'n-readlines'

export class LineInfo {
  isEof = false
  txt
}

export class LineReader {
  _liner

  constructor (fileName) {
    this._liner = new LineByLine(`./${fileName}`)
  }

  getNextLine = () => {
    const line = this._liner.next()
    const info = new LineInfo()
    if (line) {
      info.txt = line.toString('ascii')
    } else {
      info.isEof = true
    }

    return info
  }
}
