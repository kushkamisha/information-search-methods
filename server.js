const express = require('express')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
const app = express()
const port = 3000

app.use(express.static('public'))

app.post('/search', async (req, res) => {
    const { text } = req.query
    const { body } = await client.search({
        index: 'quotes',
        body: {
            query: {
                match: { quote: text }
            }
        }
    })

    res.send(body.hits.hits)
})

app.listen(port, () => console.log(`The server is listening on port ${port}`))
