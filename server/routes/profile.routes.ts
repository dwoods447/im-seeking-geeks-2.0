import { Express } from 'express'
import ProfileController from '../controllers/ProfileController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import jwtToken from 'jsonwebtoken'
const profileRoutes = function profileRoutes(app: Express) {
  app.get('/inbox/messages', isAuthenticated, ProfileController.getInboxMessagesForUser) // CHECKED
  app.get('/sender/:senderId/messages', isAuthenticated, ProfileController.getMessagesFromSender) // CHECKED
  app.get('/sent/messages', isAuthenticated, ProfileController.getSentMessagesForUser) // CHECKED
  app.get('/profile/views', isAuthenticated, ProfileController.getUserProfileViews) // CHECKED
  app.get('/user-list/blocked', isAuthenticated, isAuthenticated, ProfileController.getUsersInBlockList) // CHECKED
  app.get('/user-list/favorites', isAuthenticated, ProfileController.getUsersInFavoriteList) // CHECKED
  app.get('/user/matchmaker', isAuthenticated, ProfileController.getRandomUserForMatchMaker)
  app.get('/view/random/users', isAuthenticated, ProfileController.getRandomTenRandomUsers)
  app.post('/add-user/matchlist', isAuthenticated, ProfileController.addUserToMatchList)
  app.post('/user/update/userprofile', isAuthenticated, ProfileController.updateExtendedUserProfile)
  app.post('/add/favorites', isAuthenticated, ProfileController.addUserToFavorites) // CHECKED
  app.post('/remove/favorites', isAuthenticated, ProfileController.removeUserFromFavorites)
  app.post('/user/block/add', isAuthenticated, ProfileController.addUserToBlockList) // CHECKED
  app.post('/user/block/remove', isAuthenticated, ProfileController.removeUserFromBlockList)
  app.post('/view/user', isAuthenticated, ProfileController.retrieveProfile) // CHECKED
  app.post('/basic/search', isAuthenticated, ProfileController.basicProfileSearch) // CHECKED
  app.post('/advanced/search', isAuthenticated, ProfileController.advancedProfileSearch)
  app.post('/send/message', isAuthenticated, ProfileController.sendMessageToInbox) // CHECKED

  // app.post('/mark/message/read', isAuthenticated, ProfileController.markMessageAsRead)
  // app.post('/remove/user', isAuthenticated, ProfileController.deleteUserProfile)
  // app.post('/image/upload', isAuthenticated, ProfileController.uploadImage)
  // app.post('/remove/image/upload', isAuthenticated, ProfileController.deleteImage)
}
export default profileRoutes
