#!/usr/bin/env node

"use strict";

require('./helper')
let fs = require('fs').promise
let express = require('express')
let morgan = require('morgan')
let trycatch = require('trycatch')
let wrap = require('co-express')
let bodyParser = require('simple-bodyparser')
let path = require('path')

function* main() {
    console.log('Starting server...')
    let app = express()
    app.use(morgan('dev'))
    app.use((req, res, next) => {
        trycatch(next, e => {
            console.log(e.stack)
            res.writeHead(500)
            res.end(e.stack)
        })
    })
    app.get('*', wrap(read))

    app.put('*', wrap(create))

    app.post('*', bodyParser(), wrap(update))

    app.del('*', wrap(remove))
    //app.all('*', (req, res) => res.end('hello\n'))
    let port = 8000
     app.listen(port)
    console.log('LISTENING @ http://127.0.0.1:'+port)
    // Your implementation here
}

function* read(req, res) {
    console.log("read")
    let filePath = path.join(__dirname, 'files', req.url)
    let data = yield fs.readFile(filePath)
    res.end(data)
}

function* create(req, res) {
    console.log("create")
    let filePath = path.join(__dirname, 'files', req.url)
    let data = yield fs.open(filePath, "wx")
    res.end()
}

function* update(req, res) {
    console.log("update")
    let filePath = path.join(__dirname, 'files', req.url)
    let data = yield fs.writeFile(filePath, req.body)
    console.log(req.body)
    res.end()
}

function* remove(req, res) {
    console.log("delete")
    let filePath = path.join(__dirname, 'files', req.url)
    let data = yield fs.unlink(filePath)
    res.end()
}

module.exports = main
