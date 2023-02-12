import { Request, Response, NextFunction } from 'express'
import ProfileService from '../services/ProfileService.js'
import UserService from '../services/UserService.js'
const ProfileController = {
    async getProfileTest(req: Request, res: Response, next: NextFunction){
        return res.json({message: 'This is this ProfileTest Route!!!!!'})
    },
    async getInboxMessagesForUser(req: Request, res: Response, next: NextFunction){
            const user = await UserService.checkIfUserLoggedIn(req.body.userId)
            if(user) return res.status(401).json({message: 'Unauthorized you are not logged in!'})
            const totalItems = await ProfileService.getTotalMessageCountForUser(req.body.userId)
            if(totalItems) return res.status(400).json({message: 'Something went wrong!'})
            const authUsersMessages = ProfileService.getMessagesForAuthenticatedUser(req.body.userId)
            if(authUsersMessages) return res.status(400).json({message: 'Something went wrong!'})
            if(totalItems.length && totalItems[0].hasOwnProperty('total_messages'))  return res.status(200).json({ messages: authUsersMessages, totalItems: totalItems[0]?.total_messages })
    },
    async getMessagesFromSender(req: Request, res: Response, next: NextFunction){

    },
    async getSentMessagesForUser(req: Request, res: Response, next: NextFunction){

    },
    async getUserProfileViews(req: Request, res: Response, next: NextFunction){

    },
    async getUsersInBlockList(req: Request, res: Response, next: NextFunction){

    },
    async getUsersInFavoriteList(req: Request, res: Response, next: NextFunction){

    },
    async getRandomUserForMatchMaker(req: Request, res: Response, next: NextFunction){

    },
    async getRandomTenRandomUsers(req: Request, res: Response, next: NextFunction){

    },
    async addUserToMatchList(req: Request, res: Response, next: NextFunction){

    },
    async updateExtendedUserProfile(req: Request, res: Response, next: NextFunction){

    },
    async addUserToFavorites(req: Request, res: Response, next: NextFunction){

    },
    async removeUserFromFavorites(req: Request, res: Response, next: NextFunction){

    },
    async addUserToBlockList(req: Request, res: Response, next: NextFunction){

    },
    async removeUserFromBlockList(req: Request, res: Response, next: NextFunction){

    }
}

export default ProfileController