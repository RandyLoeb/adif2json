import { Adi2JsonArrayGetter } from './Adi2JsonArrayGetter.js'
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
