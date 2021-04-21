const express = require('express')
const quotes = require('./data/quotes');
const Retrieval = require('./src/Retrieval');
const app = express()
const port = 3000

const rt = new Retrieval(K = 2, B = 0.75)
rt.index(quotes);
const limit = 5;

app.use(express.json())
app.use(express.static('public'))

app.get('/search', async (req, res) => {
    const { text } = req.query
    const found = rt.search(text, limit)
    console.log({ found })
    res.send(found);
})

app.listen(port, () => console.log(`The server is listening on port ${port}`))
