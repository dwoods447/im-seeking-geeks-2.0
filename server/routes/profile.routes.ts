
import { Express } from 'express'
import ProfileController from '../controllers/ProfileController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'

const profileRoutes =  function profileRoutes (app: Express){
    app.get('/profile/test', ProfileController.getProfileTest) // isAuthenticated
    app.get('/inbox/messages', isAuthenticated, ProfileController.getInboxMessagesForUser) // isAuthenticated
    app.get('/sender/:senderId/messages', isAuthenticated, ProfileController.getMessagesFromSender) // isAuthenticated
    app.get('/sent/messages', isAuthenticated, ProfileController.getSentMessagesForUser)  // isAuthenticated
    app.get('/profile/views',isAuthenticated, ProfileController.getUserProfileViews)  // isAuthenticated
    app.get('/user-list/blocked', ProfileController.getUsersInBlockList)  // isAuthenticated
    app.get('/user-list/favorites', isAuthenticated, ProfileController.getUsersInFavoriteList)  // isAuthenticated
    app.get('/user/matchmaker', isAuthenticated, ProfileController.getRandomUserForMatchMaker)  // isAuthenticated
    app.get('/view/random/users', isAuthenticated, ProfileController.getRandomTenRandomUsers)
    app.post('/add-user/matchlist', isAuthenticated, ProfileController.addUserToMatchList)  // isAuthenticated
    app.post('/user/update/userprofile',isAuthenticated, ProfileController.updateExtendedUserProfile)  // isAuthenticated
    app.post('/add/favorites', isAuthenticated, ProfileController.addUserToFavorites)  // isAuthenticated
    app.post('/remove/favorites', isAuthenticated, ProfileController.removeUserFromFavorites)  // isAuthenticated
    app.post('/user/block/add', isAuthenticated, ProfileController.addUserToBlockList)  // isAuthenticated
    app.post('/user/block/remove', isAuthenticated, ProfileController.removeUserFromBlockList)  // isAuthenticated

}
export default profileRoutes