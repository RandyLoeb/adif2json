import { LineReader } from './LineReader.js'

class Adi2JsonArrayGetterInfo {
  recordBuffer = []
  headerDone = false
  keepGoing = true
  recordsFound = 0
  jsonRecords = []
  lineInfo
}

export class Adi2JsonArrayGetter {
  static adifLinesToJson = (getterInfo) => {
    const jsonRecord = {}
    getterInfo.recordBuffer.forEach(x => {
      const match = x.match(/<(.*?):(.*?)>(.*)/)
      const parsedInt = parseInt(match[3])
      jsonRecord[match[1]] = isNaN(parsedInt) ? match[3] : parsedInt
    })
    getterInfo.jsonRecords.push(jsonRecord)
  }

  static analyze = (getterInfo) => {
    if (!getterInfo.headerDone) {
      if (getterInfo.lineInfo.txt.indexOf('<eoh>') > -1) {
        getterInfo.headerDone = true
        // do something with the header?
        // for now we have no interest
        getterInfo.recordBuffer = []
      } else {
        getterInfo.recordBuffer.push(getterInfo.lineInfo.txt)
      }
      return
    }

    if (getterInfo.lineInfo.txt.indexOf('<eor>') > -1) {
      // we've reached the end of a record and the buffer has the record,
      // do something with it
      getterInfo.recordsFound++
      this.adifLinesToJson(getterInfo)
      getterInfo.recordBuffer = []
    } else {
      if (getterInfo.lineInfo.txt.replace(/\s+/g, '').length > 0) {
        getterInfo.recordBuffer.push(getterInfo.lineInfo.txt)
      }
    }
  }

  static getArray = (fileName) => {
    let isEof = false
    const getterInfo = new Adi2JsonArrayGetterInfo()
    const lineReader = new LineReader(`${fileName}`)
    while (!isEof && getterInfo.keepGoing) {
      getterInfo.lineInfo = lineReader.getNextLine()
      if (getterInfo.lineInfo.isEof) {
        isEof = true
      } else {
        this.analyze(getterInfo)
      }
    }

    return getterInfo.jsonRecords
  }
}
