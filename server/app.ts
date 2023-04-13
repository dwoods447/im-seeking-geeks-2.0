import * as dotenv from 'dotenv'
dotenv.config()

import createServer from './utils/server.js'
import { defaultConfig } from './config/default.server.js'
import connect from './utils/connect.js'

const connectToDB = async () => {
  return await connect()
}
const { app } = createServer()

try {
  connectToDB()
  /* tslint:disable-next-line */
  app.listen(defaultConfig.PORT, async () => {
    console.log(`SERVER listening at  ${defaultConfig.HOST}:${defaultConfig.PORT}!`)
  })
} catch (err) {}

export default {
  handler: app,
}
