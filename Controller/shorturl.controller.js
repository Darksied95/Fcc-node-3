const dns = require('dns');


const storage = []


function postShorturl(req, res) {
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


    for (const url of storage) {
      if (url.original_url === original_url)
        return res.json(url)
    }

    storage.push(resultModel)
    res.json(resultModel)
  })

}


function getShorturl(req, res) {
  res.redirect(storage[req.params.id - 1].original_url)
}


module.exports = {
  postShorturl,
  getShorturl
}