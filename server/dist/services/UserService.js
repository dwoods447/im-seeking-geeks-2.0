import User from '../models/user.model.js';
const UserService = {
    async checkIfUserIdExists(userId) {
        try {
            const user = await User.findOne({ _id: userId });
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkUserNameExists(username) {
        try {
            const userName = await User.findOne({ username });
            return userName;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async checkEmailExists(email) {
        try {
            const userEmail = await User.findOne({ email });
            return userEmail;
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
                profileViews: { views: [] }
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
            const views = await User.findOne({ _id: userId }).populate({ path: 'profileViews.views.userId', select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'] }).select(['-password']);
            return views.profileViews.views;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async findUsersInBlockedList(userId) {
        try {
            const users = await User.findById(userId).populate({ path: 'blockedUsers.users.userId', select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'] });
            return users;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async findUsersFavorites(userId) {
        try {
            const user = await User.findById(userId).populate({ path: 'favorites.users.userId', select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'] });
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    },
    async getRandomMatchByGender(selectedGenders, currentUser) {
        const users = await User.aggregate([
            {
                $match: { gender: { $in: selectedGenders } }
            },
            { $sample: { size: 1 } },
            { $project: { password: 0 } }
        ]);
        const matches = users.filter((user) => {
            if (user._id.toString() !== currentUser)
                return user;
        });
        return users;
    },
    async getTenRandomUsers(userId) {
        try {
            const filter = {};
            const users = await User.aggregate([
                { $sample: { size: 10 } }
            ]);
            const userToReturn = users.filter((user) => {
                return user._id.toString() !== userId;
            });
            return users;
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
};
export default UserService;
//# sourceMappingURL=UserService.js.map