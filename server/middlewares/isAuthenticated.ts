import jwt from 'jsonwebtoken'
import { ExtendedRequest, ExtendedResponse, ExtendedNextFunction } from '../types/express.extended.js'
import { defaultConfig } from '../config/default.server.js'
import { UserPayload } from '../types/jwt.js'


const isAuthenticated  = (req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) => {
    const authorizedHeader = req.get('Authorization');
    if(!authorizedHeader){
        const error = new Error('Not Authenticated.');
        error.message = 'Not Authenticated.';
        throw error;
    }
    const token  = authorizedHeader.split(' ')[1];
    let decodedToken
    try {
      decodedToken = jwt.verify(token, defaultConfig.authentication.jwtSecret) as UserPayload;
    } catch(error){
      throw error;
    }
    
  if(!decodedToken){
    const error  = new Error('Not Authenticated.');
    error.message = 'Not Authenticated.';
    throw error;
  }

  req.userId = decodedToken.userId;
}

export default isAuthenticated