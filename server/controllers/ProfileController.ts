import { ExtendedRequest, ExtendedResponse, ExtendedNextFunction } from '../types/express.extended.js'
import ProfileService from '../services/ProfileService.js'
import UserService from '../services/UserService.js'
const ProfileController = {
    async getProfileTest(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        return res.json({message: 'This is this ProfileTest Route!!!!!'})
    },
    async sendMessageToInbox(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        const { userProfileId, message } = req.body
        const sender = await UserService.checkIfUserLoggedIn(req.userId)
    },
    async getInboxMessagesForUser(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
            const user = await UserService.checkIfUserLoggedIn(req.userId) // 
            if(user) return res.status(401).json({message: 'Unauthorized you are not logged in!'})
            const totalItems = await ProfileService.getTotalMessageCountForUser(req.body.userId)
            if(totalItems) return res.status(400).json({message: 'Something went wrong!'})
            const authUsersMessages = ProfileService.getMessagesForAuthenticatedUser(req.body.userId)
            if(authUsersMessages) return res.status(400).json({message: 'Something went wrong!'})
            if(totalItems.length && totalItems[0].hasOwnProperty('total_messages'))  return res.status(200).json({ messages: authUsersMessages, totalItems: totalItems[0]?.total_messages })
    },
    async getMessagesFromSender(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async getSentMessagesForUser(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async getUserProfileViews(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async getUsersInBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async getUsersInFavoriteList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async getRandomUserForMatchMaker(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async getRandomTenRandomUsers(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async addUserToMatchList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async updateExtendedUserProfile(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async addUserToFavorites(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async removeUserFromFavorites(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async addUserToBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    },
    async removeUserFromBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){

    }
}

export default ProfileController