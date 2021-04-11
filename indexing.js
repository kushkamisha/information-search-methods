const fs = require('fs')
const path = require('path')
const util = require('util')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function run() {
    const dataFile = path.join(__dirname, 'data', 'quotes.json')
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))

    const toIndex = []

    data.forEach((quote) => {
        toIndex.push({ index: { _index: 'quotes' } })
        toIndex.push(quote)
    })

    const { body: bulkResponse } = await client.bulk({
        refresh: true,
        body: toIndex,
    })

    if (bulkResponse.errors) {
        console.log(util.inspect(bulkResponse, true, null, true))
        process.exit(1)
    }
}

run().catch(console.log)