const express = require('express');
function createServer(){
    const app = express()
    const router = express.Router()
    return {
        app,
        router
    }
}



module.exports = createServer()