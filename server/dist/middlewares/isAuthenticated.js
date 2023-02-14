import jwt from 'jsonwebtoken';
import { defaultConfig } from '../config/default.server.js';
const isAuthenticated = (req, res, next) => {
    const authorizedHeader = req.get('Authorization');
    if (!authorizedHeader) {
        const error = new Error('Not Authenticated.');
        error.message = 'Not Authenticated.';
        throw error;
    }
    const token = authorizedHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, defaultConfig.authentication.jwtSecret);
    }
    catch (error) {
        throw error;
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated.');
        error.message = 'Not Authenticated.';
        throw error;
    }
    req.userId = decodedToken.userId;
};
export default isAuthenticated;
//# sourceMappingURL=isAuthenticated.js.map