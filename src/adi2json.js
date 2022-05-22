import { Adi2JsonArrayGetter } from './Adi2JsonArrayGetter.js'
const fileName = './src/kn4yrm.255557.20220522041446.adi'

const ary = Adi2JsonArrayGetter.getArray(fileName)
console.log(`Records:${ary.length}`)
