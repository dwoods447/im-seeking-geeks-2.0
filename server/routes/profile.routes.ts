
import { Express } from 'express'
import ProfileController from '../controllers/ProfileController.js'

const profileRoutes =  function profileRoutes (app: Express){
    app.get('/profile/test', ProfileController.getProfileTest) // isAuthenticated
    app.get('/inbox/messages', ProfileController.getInboxMessagesForUser) // isAuthenticated
    app.get('/sender/:senderId/messages', ProfileController.getMessagesFromSender) // isAuthenticated
    app.get('/sent/messages', ProfileController.getSentMessagesForUser)  // isAuthenticated
    app.get('/profile/views', ProfileController.getUserProfileViews)  // isAuthenticated
    app.get('/user-list/blocked', ProfileController.getUsersInBlockList)  // isAuthenticated
    app.get('/user-list/favorites', ProfileController.getUsersInFavoriteList)  // isAuthenticated
    app.get('/user/matchmaker', ProfileController.getRandomUserForMatchMaker)  // isAuthenticated
    app.get('/view/random/users', ProfileController.getRandomTenRandomUsers)
    app.post('/add-user/matchlist', ProfileController.addUserToMatchList)  // isAuthenticated
    app.post('/user/update/userprofile', ProfileController.updateExtendedUserProfile)  // isAuthenticated
    app.post('/add/favorites', ProfileController.addUserToFavorites)  // isAuthenticated
    app.post('/remove/favorites', ProfileController.removeUserFromFavorites)  // isAuthenticated
    app.post('/user/block/add', ProfileController.addUserToBlockList)  // isAuthenticated
    app.post('/user/block/remove', ProfileController.removeUserFromBlockList)  // isAuthenticated

}
export default profileRoutes