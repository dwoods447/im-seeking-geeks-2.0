import bcrypt from 'bcryptjs'
import { Request, Response, NextFunction } from 'express'
import UserService from '../services/UserService.js'



const AuthController = {
    async userRegistration(req: Request, res: Response, next: NextFunction){
        const { username, email, password, gender, birthdate, ethnicity } = req.body
        const userName = await UserService.checkUserExists(username)
        if(userName) return res.status(422).json({ message: 'Username already exists!', statusCode: 422 })
        const userEmail = await UserService.checkEmailExists(email)
        if (userEmail) return res.status(422).json({ message: 'That Email already exists!', statusCode: 422 })
        const hashedPassword = bcrypt.hashSync(password, 12)
        const newUser = await UserService.createNewUser(username, email, hashedPassword, gender, birthdate, ethnicity)
        if (!newUser) return res.status(500).json({ message: 'There was an error saving a new user please try again ', statusCode: 500 })
    },
    async userLogin(req: Request, res: Response, next: NextFunction){
        return res.json({message: 'This is the User Login Route!!!!'})
    },
    async checkUserNameUnique(req: Request, res: Response, next: NextFunction){

    },
    async checkUserEmailUnique(req: Request, res: Response, next: NextFunction){

    },
    async userLogout(req: Request, res: Response, next: NextFunction){

    },
    async resetPassword(req: Request, res: Response, next: NextFunction){

    },
    async updatePassword(req: Request, res: Response, next: NextFunction){

    }
}


export default AuthController