const express = require('express')
const { Client } = require('@elastic/elasticsearch')
const { addToDb } = require('./controller')
const client = new Client({ node: 'http://localhost:9200' })
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('public'))

app.get('/search', async (req, res) => {
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

app.post('/add', async (req, res) => {
    const { author, quote } = req.body
    await addToDb(author, quote);
    console.log('Successful adding a new quote')
    res.send('Success')
})

app.listen(port, () => console.log(`The server is listening on port ${port}`))
