import bcrypt from 'bcryptjs';
import UserService from '../services/UserService.js';
const AuthController = {
    async userRegistration(req, res, next) {
        const { username, email, password, gender, birthdate, ethnicity } = req.body;
        const userName = await UserService.checkUserExists(username);
        if (userName)
            return res.status(422).json({ message: 'Username already exists!', statusCode: 422 });
        const userEmail = await UserService.checkEmailExists(email);
        if (userEmail)
            return res.status(422).json({ message: 'That Email already exists!', statusCode: 422 });
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = await UserService.createNewUser(username, email, hashedPassword, gender, birthdate, ethnicity);
        if (!newUser)
            return res.status(500).json({ message: 'There was an error saving a new user please try again ', statusCode: 500 });
    },
    async userLogin(req, res, next) {
        return res.json({ message: 'This is the User Login Route!!!!' });
    },
    async checkUserNameUnique(req, res, next) {
    },
    async checkUserEmailUnique(req, res, next) {
    },
    async userLogout(req, res, next) {
    },
    async resetPassword(req, res, next) {
    },
    async updatePassword(req, res, next) {
    }
};
export default AuthController;
//# sourceMappingURL=AuthController.js.map