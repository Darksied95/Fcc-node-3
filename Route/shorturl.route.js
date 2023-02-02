const express = require('express')
const Router = express.Router()
const { postShorturl, getShorturl } = require('../Controller/shorturl.controller')



Router.post("/", postShorturl)
Router.get("/:id", getShorturl)

module.exports = Router