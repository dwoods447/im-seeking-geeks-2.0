import User from '../models/user.model.js';
const UserService = {
    async getLimitedUser(username, fields) {
        try {
            const limitedUser = await User.findOne({ username }).select(fields);
            return limitedUser;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkIfUserIdExists(userId) {
        /*  User projection to limit fields
                  // https://mongoosejs.com/docs/api.html#query_Query-projection
            */
        const projection = { password: 0 };
        try {
            const user = await User.findOne({ _id: userId }, projection);
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkUserNameExists(username) {
        try {
            const userName = await User.findOne({ username: username });
            return userName;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkEmailExists(email) {
        try {
            const projection = { password: 0 };
            const userEmail = await User.findOne({ email: email }, projection);
            return userEmail;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkIfUserIsBlocked(currentUser, targetUser) {
        try {
            return currentUser.checkIfUserIsBlocked(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async createNewUser(username, email, password, gender, birthdate, ethnicity) {
        try {
            const newUser = new User({
                random: 'false',
                username,
                email,
                password,
                gender,
                birthdate,
                // age: moment(new Date(), 'MM/DD/YYYY').diff(moment(birthdate, 'MM/DD/YYYY'), 'years'),
                ethnicity,
                onlineStatus: false,
                seekingGender: '',
                height: '',
                relationshipTypeSeeking: '',
                hairColor: '',
                eyeColor: '',
                highestEducation: '',
                secondLanguage: '',
                bodyType: '',
                postalCode: '',
                city: '',
                state: '',
                martialStatus: '',
                hasChildren: false,
                doesSmoke: false,
                doesDoDrugs: false,
                doesDrink: false,
                religion: '',
                profession: '',
                doesHavePets: false,
                ambitiousness: '',
                datingIntent: '',
                longestRelationShip: '',
                income: '',
                doesDateInteracially: false,
                interacialDatingPreferences: [],
                raceDatingPreferences: [],
                isProfileCompleted: false,
                isPremiumUser: false,
                blockedUsers: { users: [] },
                favorites: { users: [] },
                profileViews: { views: [] },
            });
            return await newUser.save();
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkIfUserLoggedIn(userId) {
        try {
            const user = await User.findOne({ _id: userId });
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async getProfileViews(userId) {
        try {
            const views = await User.findOne({ _id: userId })
                .populate({
                path: 'profileViews.views.userId',
                select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'],
            })
                .select(['-password']);
            return views.profileViews.views;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async getUsersBlockedList(userId) {
        try {
            const users = await User.findById(userId).populate({
                path: 'blockedUsers.users.userId',
                select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'],
            });
            return users;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async findUsersFavorites(userId) {
        try {
            const user = await User.findById(userId).populate({
                path: 'favorites.users.userId',
                select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'],
            });
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async getRandomMatchByGender(selectedGenders, currentUser) {
        const users = await User.aggregate([
            {
                $match: { gender: { $in: selectedGenders } },
            },
            { $sample: { size: 1 } },
            { $project: { password: 0 } },
        ]);
        const matches = users.filter((user) => {
            if (user._id.toString() !== currentUser)
                return user;
        });
        return matches;
    },
    async getTenRandomUsers(userId) {
        try {
            const filter = {};
            const users = await User.aggregate([{ $sample: { size: 10 } }]);
            const userToReturn = users.filter((user) => {
                return user._id.toString() !== userId;
            });
            return userToReturn;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async findTargetUserToAddForMatchList(targetUserId) {
        try {
            const targetUser = await User.findById(targetUserId);
            return targetUser;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async addUnMatchedToMatchList(currentUser, targetUser) {
        try {
            const matchList = currentUser.addUserToMatchList(targetUser);
            return matchList;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkMutalMatch(targetUser, currentUser) {
        try {
            const isMutualMatch = targetUser.checkIfUserIsMutualMatch(currentUser);
            return isMutualMatch;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkIfUserIsAlreadyInFavorites(currentUser, targetUser) {
        try {
            return currentUser.checkIfUserIsAlreadyInFavorites(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async addUserToFavoriteList(currentUser, targetUser) {
        try {
            return currentUser.addUserToFavorites(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async removeUserFromFavoriteList(currentUser, targetUser) {
        try {
            return currentUser.removeUserFromFavorites(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async addUserToBlockList(blocker, targetUser) {
        try {
            return blocker.addUserToBlockList(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async removeUserFromBlockList(currentUser, targetUser) {
        try {
            return currentUser.removeUserFromBlockList(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async addProfileViewer(currentUser, targetUser) {
        try {
            return currentUser.addProfileViewer(targetUser);
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async deleteUser(userId) {
        try {
            const userDeleted = await User.deleteOne({ _id: userId });
            return userDeleted;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async updateUsersAge(targetedUser) {
        await targetedUser.updateUserAge();
    },
};
export default UserService;
//# sourceMappingURL=UserService.js.map