require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
let storage = [{
  "original_url": "https://www.youtube.com/watch?v=fqrweofuvr4",
  "short_url": 1
}]

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  let { url } = req.body

  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return res.json({ error: 'invalid url' })
  }
  const original_url = url.toLowerCase()
  url = url.replace(/https?:\/\//, '')

  let host;
  try {
    host = new URL(original_url).host
  } catch (error) {
    return res.json({ error: 'invalid url' })
  }
  dns.lookup(host, (err) => {

    if (err) {
      return res.json({ error: 'invalid url' })
    }

    let resultModel = {
      original_url,
      short_url: storage.length + 1
    }

    for (let i = 0; i < storage.length; i++) {
      if (storage[i].original_url === original_url) {
        return res.json(storage[i])
      }
    }


    storage.push(resultModel)
    res.json(resultModel)
  })

})

app.get('/api/shorturl/:id', async (req, res) => {
  res.redirect(storage[req.params.id - 1].original_url)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
