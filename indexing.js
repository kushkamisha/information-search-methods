const fs = require('fs')
const path = require('path')
const util = require('util')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function run() {
    // Delet old index if there is any
    try {
        await client.indices.delete({
            index: 'quotes',
        })
        console.log('Successfully deleted an old index')
    } catch (err) {
        if (err.message !== 'index_not_found_exception')
            console.trace(err.message)
    }

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

    console.log('Successfully created a new index')
}

run()
