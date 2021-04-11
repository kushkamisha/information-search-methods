const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function search() {
    // Let's search!
    const { body } = await client.search({
        index: 'quotes',
        body: {
            query: {
                match: { quote: 'love him' }
            }
        }
    })

    console.log(body.hits.hits)
}

search().catch(console.log)
