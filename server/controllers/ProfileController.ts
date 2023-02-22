import { ExtendedRequest, ExtendedResponse, ExtendedNextFunction } from '../types/express.extended.js'
import ProfileService from '../services/ProfileService.js'
import UserService from '../services/UserService.js'

const ProfileController = {
    async sendMessageToInbox(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        const { userProfileId, message } = req.body
        const sender = await UserService.checkIfUserLoggedIn(req.userId)
    },
    async getInboxMessagesForUser(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
            const user = await UserService.checkIfUserLoggedIn(req.userId) // 
            if(!user) return res.status(401).json({message: 'Unauthorized you are not logged in!'})
            const totalItems = await ProfileService.getTotalMessageCountForUser(req.userId)
            const authUsersMessages = await ProfileService.getMessagesForAuthenticatedUser(req.userId)
            return res.status(200).json({ messages: authUsersMessages, totalItems: totalItems })
    },
    async getMessagesFromSender(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
         const loggedInUser = await UserService.checkIfUserIdExists(req.userId)
         if(!loggedInUser) return res.status(401).json({message: 'Unauthorized you are not logged in!'})
         const { senderId } = req.params
         const msgSender = await  UserService.checkIfUserIdExists(senderId)
         if(!msgSender) return res.status(400).json({message: "User's account has been removed!", deletedAccount: true})
         const messages = await ProfileService.getMessageThreadForUsers(req.userId, senderId)
         return res.status(200).json({ messages: messages, deletedAccount: false })
    },
    async getSentMessagesForUser(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        const loggedInUser = await UserService.checkIfUserIdExists(req.userId)
        if(!loggedInUser) return res.status(401).json({message: 'Unauthorized you are not logged in!'})
        const mySentMesages = await ProfileService.getSentMessagesForLoggedInUser(req.userId)
        return res.status(200).json({ messages: mySentMesages })

    },
    async getUserProfileViews(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        const authorizedUser = await UserService.checkIfUserLoggedIn(req.userId)
        if (!authorizedUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
        const userViews = await UserService.getProfileViews(req.userId)
        if(!userViews) return res.status(400).json({ message: 'Something went wront with the request!', views: [] })
        return res.status(200).json({ views: userViews })
    },
    async getUsersInBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        const authorizedUser = await UserService.checkIfUserLoggedIn(req.userId)
        if (!authorizedUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
        let usersInBlockList = []
        const blockedUsers = await UserService.findUsersInBlockedList(req.userId)
        usersInBlockList = blockedUsers.blockedUsers.users
        return res.status(200).json({ blockList: usersInBlockList })
    },
    async getUsersInFavoriteList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        const authorizedUser = await UserService.checkIfUserLoggedIn(req.userId)
        if (!authorizedUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
        let userInFavoritesList = []
        const users = await UserService.findUsersFavorites(req.userId)
        userInFavoritesList = users.favorites.users
        return res.status(200).json({ favoriteList: userInFavoritesList })

    },
    async getRandomUserForMatchMaker(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        let selectedGenders = []
            const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
            if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
            selectedGenders = currentUser.seekingGenders.genders
            const randomMatches = await UserService.getRandomMatchByGender(selectedGenders, req.userId)
            return res.status(200).json({ users: randomMatches })
    },
    async getRandomTenRandomUsers(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        try {
            const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
            if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
            const users = await UserService.getTenRandomUsers(req.userId)
            return res.json({ users: users })
          } catch (err) {
            next(err)
          }

    },
    async addUserToMatchList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        let isMutualMatch = false
        const { userProfileId } = req.body
        const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
        if(!currentUser) return res.status(401).json({message: 'Please log in to view favorites'})
        const userToAdd = await UserService.findTargetUserToAddForMatchList(userProfileId)
        if(!userToAdd) return res.status(400).json({message: 'User you tried to add doesnt exist'})
        await UserService.addUnMatchedToMatchList(currentUser, userToAdd)
        const mutualMatch = await UserService.checkMutalMatch(currentUser, userToAdd)
        if (mutualMatch) {
            isMutualMatch = true
            return res.status(200).json({ message: 'User added to matches successfully! And is a Mutual Match', isMutualMatch: isMutualMatch })
        }
        return res.status(200).json({ message: 'User added to matches successfully!', isMutualMatch: isMutualMatch })
    },
    async updateExtendedUserProfile(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        return res.status(200).json({message: 'This is this ProfileTest Route!!!!!'})
    },
    async addUserToFavorites(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        return res.status(200).json({message: 'This is this ProfileTest Route!!!!!'})

    },
    async removeUserFromFavorites(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        return res.status(200).json({message: 'This is this ProfileTest Route!!!!!'})
    },
    async addUserToBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        return res.status(200).json({message: 'This is this ProfileTest Route!!!!!'})

    },
    async removeUserFromBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction){
        return res.status(200).json({message: 'This is this ProfileTest Route!!!!!'})
    },

}

export default ProfileController