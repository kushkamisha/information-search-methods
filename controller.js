const fs = require('fs')
const path = require('path')
const { index } = require('./indexing')

const dataFile = path.join(__dirname, 'data', 'quotes.json')

async function addToDb(author, quote) {

    return new Promise((resolve, reject) => {
        fs.readFile(dataFile, { encoding: 'utf-8' }, (err, data) => {
            const json = JSON.parse(data)
            console.log(`Adding ${JSON.stringify({ author, quote })}`)
            json.push({ author, quote })

            fs.writeFile(dataFile, JSON.stringify(json), async (err) => {
                if (err) reject(err)
                index()
                resolve()
            })
        })
    })
}

module.exports = {
    addToDb,
}
