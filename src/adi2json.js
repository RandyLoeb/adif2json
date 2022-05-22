import { LineReader } from './LineReader.js'
const fileName = 'kn4yrm.255557.20220522041446.adi'
const lineReader = new LineReader(`./src/${fileName}`)

let isEof = false
let lineInfo
let recordBuffer = []
let headerDone = false
let keepGoing = true
let recordsFound = 0
const jsonRecords = []

const adifLinesToJson = () => {
  const jsonRecord = {}
  recordBuffer.forEach(x => {
    const match = x.match(/<(.*?):(.*?)>(.*)/)
    // console.log(match)
    const parsedInt = parseInt(match[3])
    jsonRecord[match[1]] = parsedInt === 'NaN' ? match[3] : parsedInt
  })
  jsonRecords.push(jsonRecord)
  // console.log(JSON.stringify(jsonRecord))
}

const analyze = (s) => {
  if (!headerDone) {
    if (s.indexOf('<eoh>') > -1) {
      headerDone = true
      // do something with the header?
      // for now we have no interest
      // console.log(recordBuffer.join('\n'))
      recordBuffer = []
    } else {
      recordBuffer.push(s)
    }
    return
  }

  if (s.indexOf('<eor>') > -1) {
    // we've reached the end of a record and the buffer has the record,
    // do something with it
    recordsFound++
    // if (recordsFound < 2) {
    // console.log(`Record ${recordsFound}:`)
    // console.log(recordBuffer.join('\n'))
    // console.log('\n')
    adifLinesToJson()
    recordBuffer = []
    // } else {
    // keepGoing = false
    // }
  } else {
    if (s.replace(/\s+/g, '').length > 0) {
      recordBuffer.push(s)
    }
  }
}

// eslint-disable-next-line no-unmodified-loop-condition
while (!isEof && keepGoing) {
  lineInfo = lineReader.getNextLine()
  if (lineInfo.isEof) {
    isEof = true
  } else {
    analyze(lineInfo.txt)
  }
}

console.log(`JsonRecords:${jsonRecords.length}`)
