
import { Express, Router } from 'express'
import AuthController from '../controllers/AuthController.js'

export function authRoutes (app: Express){
    app.post('/login', AuthController.userLogin)
    app.post('/register', AuthController.userRegistration)
    app.post('/logout', AuthController.userLogout)
    app.post('/check/username/unique', AuthController.checkUserNameUnique)
    app.post('/check/email/unique', AuthController.checkUserEmailUnique)
    app.post('/user/password/reset', AuthController.resetPassword)
    app.post('/user/update/password', AuthController.updatePassword) // isPasswordRestTokenValid
}
