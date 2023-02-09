import { Request, Response, NextFunction } from 'express'
// import ProfileService from '../services/ProfileService.js'

const ProfileController = {
    async getProfileTest(req: Request, res: Response, next: NextFunction){
        return res.json({message: 'This is this ProfileTest Route!!!!!'})
    },
    async getInboxMessagesForUser(req: Request, res: Response, next: NextFunction){

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