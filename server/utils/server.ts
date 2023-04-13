import cors from 'cors'
import bodyParser from 'body-parser'
import express, { Router, Express } from 'express'
import authRoutes from '../routes/auth.routes.js'
import profileRoutes from '../routes/profile.routes.js'

export default function createServer(): { app: Express; router: Router } {
  const app = express()
  const router = Router()

  app.use(cors())
  
  app.use('/api', router)
  // parse application/json
  app.use(bodyParser.json())

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }))

  authRoutes(app)
  profileRoutes(app)
  
  

  return {
    app,
    router,
  }
}
