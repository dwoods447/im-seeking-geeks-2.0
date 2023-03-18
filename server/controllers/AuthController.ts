import bcrypt from 'bcryptjs'
import { Request, Response, NextFunction } from 'express'
import UserService from '../services/UserService.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { defaultConfig } from '../config/default.server.js'
import ProfileService from '../services/ProfileService.js'

const AuthController = {
  async checkUserNameUnique(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body
    const userName = await UserService.checkUserNameExists(username)
    if (!userName) {
      return res.status(200).json({ message: 'Username not found', usernameExists: false })
    }
    return res.status(200).json({ message: 'Username already exists!', usernameExists: true })
  },

  async checkUserEmailUnique(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const userEmail = await UserService.checkEmailExists(email)
    if (!userEmail) {
      return res.status(422).json({ message: 'Email not found', emailExists: false })
    }
    return res.status(200).json({ message: 'Email already exists!', emailExists: true })
  },
  async userRegistration(req: Request, res: Response, next: NextFunction) {
    const { username, email, password, gender, birthdate, ethnicity } = req.body
    const userName = await UserService.checkUserNameExists(username)
    if (userName) return res.status(422).json({ message: 'Username already exists!', statusCode: 422 })
    const userEmail = await UserService.checkEmailExists(email)
    if (userEmail)
      return res.status(422).json({
        message: 'That Email already exists!',
        statusCode: 422,
      })
    const hashedPassword = bcrypt.hashSync(password, 12)
    const newUser = await UserService.createNewUser(username, email, hashedPassword, gender, birthdate, ethnicity)

    if (!newUser)
      return res.status(400).json({
        message: 'There was an error saving a new user please try again ',
        statusCode: 400,
      })

    ProfileService.sendNewEmail({
      to: newUser.email,
      from: 'ImSeekingGeeks',
      subject: 'Welcome to ImSeekingGeeks',
      html: `
         <h1>Welcome, ${newUser.username} to ImSeekingGeeks</h1>
         <div>
             <ol>
                <li>Search for matches</li>
                <li>Tell us About yourself</li>
                <li>Be yourself have fun</li>
             </ol>

             <h2>Mobile App:</h2>
             <p>Coming Soon</p>
         </div>
         `,
    })
    return res.status(200).json({
      message: 'User succesfully signed up! Please login.',
      user: newUser,
      statusCode: 200,
    })
  },
  async userLogin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    const user = await UserService.checkUserNameExists(username)
    if (!user) {
      return res.status(403).json({
        message: 'Username already exists! Please sign in',
        statusCode: 403,
      })
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return res.status(403).json({
        message: 'Invalid username/password. Please try again.',
        statusCode: 403,
      })
    }
    // Update Age

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      defaultConfig.authentication.jwtSecret,
      { expiresIn: '1h' }
    )
    user.onlineStatus = true
    user.save()
    let decodedToken
    try {
      decodedToken = jwt.verify(token, defaultConfig.authentication.jwtSecret) as JwtPayload
    } catch (error) {
      throw error
    }

    res.status(200).json({
      token,
      user: user,
      tokenExpiresIn: decodedToken.exp,
    })
  },

  async userLogout(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body
    const user = await UserService.checkIfUserIdExists(userId)
    user.onlineStatus = false
    const userSaved = user.save()
    if (!userSaved) {
      return res.status(400).json({ message: 'Could not update online status' })
    }
    return res.status(200).json({ message: 'Successfully logged out' })
  },
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const user = await UserService.checkEmailExists(email)
    if (!user) {
      console.log('User doesnt exists.')
      return res.status(422).json({ message: 'No user account with that email exists.' })
    }
    let token
    try {
      token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
          password: user.password,
        },
        defaultConfig.authentication.jwtSecret,
        { expiresIn: '1h' }
      )
    } catch (err) {
      throw err
    }

    user.resetToken = token
    let exp = new Date(Date.now() + 3600000)
    user.resetTokenExpiration = exp
    const updatedUser = await user.save()
    if (!updatedUser) return res.status(400).json({ message: 'An unknown error occured' })
    const hostname = req.headers.host
    ProfileService.sendNewEmail({
      to: user.email,
      from: 'ImSeekingGeeks',
      subject: 'Password Reset for ImSeekingGeeks',
      html: `
                        <h1></h1>
                        <div>
                           If you requested a password reset click the link below to reset your password.
                           Click this <a href="http://${hostname}/updatepassword/user/${user._id.toString()}/token/${token}/">link</a> to set a new password.
                        </div>
                        `,
    })
    return res.status(200).json({
      message:
        'If a user with that account exists you will recieve an email within the hour with password reset instructions.',
    })
  },
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    const { userId, password } = req.body
    const user = await UserService.checkIfUserIdExists(userId)
    if (!user) {
      return res.status(422).json({
        message: 'We could not find the user in the system.',
      })
    }

    const hashedPassword = bcrypt.hashSync(password, 12)

    user.password = hashedPassword
    await user.save()
    return res.status(200).json({ message: 'Password updated successfully!' })
  },
  /* TODO[Demaria] -  Remove */
  async getJwtToken(req: Request, res: Response, next: NextFunction) {
    const secret = defaultConfig.authentication.jwtSecret
    const { userId, email } = req.body
    const token = jwt.sign(
      {
        email: email,
        userId: userId,
      },
      secret,
      { expiresIn: '1h' }
    )

    return res.json({ token: token })
  },
}

export default AuthController
