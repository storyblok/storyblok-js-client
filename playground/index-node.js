console.log('hey node')
// require('isomorphic-fetch')

const Client = require('../')
const { RichtextInstance } = require('../')
const cli = new Client({})
console.log(cli.get)
console.log('Imported')
