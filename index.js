require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
let storage = []

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {

  try {
    if (!req.body.url.startsWith('https://') && !req.body.url.startsWith('http://')) {
      console.log('here');
      throw new Error()
    }
    req.body.url = req.body.url.toLowerCase().replace(/https?:\/\//, '')


    dns.lookup(req.body.url, (err) => {

      if (err) {
        console.log('err', err);
        return res.json({ error: 'invalid url' })
      }

      let result = {
        original_url: req.body.url,
        short_url: storage.length
      }

      storage.push(result)
      res.json({ result })
    })
  } catch (err) {
    res.status(400).json({ error: 'invalid url' })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
