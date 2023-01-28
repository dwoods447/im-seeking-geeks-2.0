const express = require('express')

function createServer(): {app: any, router: any} {
    const app = express()
    const router = express.Router()
    return {
        app,
        router
    }
}


module.exports = {
  createServer
}
