import { Adi2JsonArrayGetter } from './Adi2JsonArrayGetter.js'
import Creds from './qrz.js'
import axios from 'axios'
import xml2js from 'xml2js'
const fileName = './src/kn4yrm.255557.20220522041446.adi'

const ary = Adi2JsonArrayGetter.getArray(fileName)
console.log(`Records:${ary.length}`)

// now I have the records and can query them!

// who was in the 2022 FL Qso party?
const flQso = ary.filter((record) => record.contest_id === 'FL-QSO-PARTY')
console.log(`FL-QSO-PARTY:${flQso.length}`)

// of those who have i never sent a qsl card to before?
const neverFlQso = flQso.filter((record) => !ary.some(x => x.call === record.call && x.qsl_sent === 'Y'))
console.log(`candidates:${neverFlQso.length}`)

// i used to use the comment line to record qsos....
const noComments = neverFlQso.filter((record) => !ary.some(x => x.call === record.call && x.comment))
console.log(`no comments:${noComments.length}`)

// now I could take that array and query qrz.com for addresses
const creds = new Creds()
const url = `https://xmldata.qrz.com/xml/current/?username=${creds.l};password=${creds.p};agent=randy1.0`
const getKey = async () => {
  const response = await axios.get(url)
  const xml = response.data
  const xmlResult = await xml2js.parseStringPromise(xml)
  return xmlResult.QRZDatabase.Session[0].Key[0]
}

const apiKey = await getKey()
const callLookupUrl = `https://xmldata.qrz.com/xml/current/?s=${apiKey};callsign=KN4YRM`

const callLookup = async () => {
  const response = await axios.get(callLookupUrl)
  const xml = response.data
  const xmlResult = await xml2js.parseStringPromise(xml)
  return xmlResult
}

const callObject = await callLookup()
console.log(JSON.stringify(callObject))
