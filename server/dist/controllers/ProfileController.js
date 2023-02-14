import ProfileService from '../services/ProfileService.js';
import UserService from '../services/UserService.js';
const ProfileController = {
    async getProfileTest(req, res, next) {
        return res.json({ message: 'This is this ProfileTest Route!!!!!' });
    },
    async sendMessageToInbox(req, res, next) {
        const { userProfileId, message } = req.body;
        const sender = await UserService.checkIfUserLoggedIn(req.userId);
    },
    async getInboxMessagesForUser(req, res, next) {
        const user = await UserService.checkIfUserLoggedIn(req.userId); // 
        if (user)
            return res.status(401).json({ message: 'Unauthorized you are not logged in!' });
        const totalItems = await ProfileService.getTotalMessageCountForUser(req.body.userId);
        if (totalItems)
            return res.status(400).json({ message: 'Something went wrong!' });
        const authUsersMessages = ProfileService.getMessagesForAuthenticatedUser(req.body.userId);
        if (authUsersMessages)
            return res.status(400).json({ message: 'Something went wrong!' });
        if (totalItems.length && totalItems[0].hasOwnProperty('total_messages'))
            return res.status(200).json({ messages: authUsersMessages, totalItems: totalItems[0]?.total_messages });
    },
    async getMessagesFromSender(req, res, next) {
    },
    async getSentMessagesForUser(req, res, next) {
    },
    async getUserProfileViews(req, res, next) {
    },
    async getUsersInBlockList(req, res, next) {
    },
    async getUsersInFavoriteList(req, res, next) {
    },
    async getRandomUserForMatchMaker(req, res, next) {
    },
    async getRandomTenRandomUsers(req, res, next) {
    },
    async addUserToMatchList(req, res, next) {
    },
    async updateExtendedUserProfile(req, res, next) {
    },
    async addUserToFavorites(req, res, next) {
    },
    async removeUserFromFavorites(req, res, next) {
    },
    async addUserToBlockList(req, res, next) {
    },
    async removeUserFromBlockList(req, res, next) {
    }
};
export default ProfileController;
//# sourceMappingURL=ProfileController.js.map