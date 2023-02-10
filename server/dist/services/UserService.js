import User from '../models/user.model.js';
const UserService = {
    async checkUserExists(username) {
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
    }
};
export default UserService;
//# sourceMappingURL=UserService.js.map