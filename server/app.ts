
import * as dotenv from 'dotenv'
dotenv.config()


import createServer from "./utils/server.js"
import { defaultConfig } from './config/default.server.js'
import connect from './utils/connect.js'

const { app } = createServer()

/* tslint:disable-next-line */
app.listen(defaultConfig.PORT, async() => {
   await connect();
   console.log(`SERVER listening at  ${defaultConfig.HOST}:${defaultConfig.PORT}!`)
})


 export default {
   handler: app
 }
