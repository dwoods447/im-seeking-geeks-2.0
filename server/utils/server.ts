import express, { Router, Express } from 'express'
import authRoutes from '../routes/auth.routes'
import profileRoutes  from '../routes/profile.routes'

export function createServer(): {app: Express, router: Router} {
  const app = express()
  const router = Router()

  authRoutes(app)
  profileRoutes(app)

  return {
      app,
      router
  }
}