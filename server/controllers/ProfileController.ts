import path from 'path'
import fs from 'fs'
import { ExtendedRequest, ExtendedResponse, ExtendedNextFunction } from '../types/express.extended.js'
import ProfileService from '../services/ProfileService.js'
import UserService from '../services/UserService.js'
import { basicUser, advancedUser } from '../types/users.js'

const ProfileController = {
  async testMethod(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { msg } = req.body
    const userID = req.userId
    res.json({
      message: 'This is the test method',
      msg: msg,
      userID: userID,
    })
  },
  async sendMessageToInbox(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { userProfileId, message } = req.body
    const sender = await UserService.checkIfUserLoggedIn(req.userId)
    if (!sender)
      return res.status(401).json({
        message: 'User is not logged in!',
      })

    const receiverOfMessage = await UserService.checkIfUserIdExists(userProfileId)
    if (!receiverOfMessage)
      return res.status(422).json({
        message: 'Unable to locate user profile',
      })
    const userBlockedYou = await UserService.checkIfUserIsBlocked(receiverOfMessage, sender)
    const youblockedUser = await UserService.checkIfUserIsBlocked(sender, receiverOfMessage)
    if (userBlockedYou || youblockedUser) {
      return res.status(403).json({
        message: 'You are prohibited from sending a message to this user!',
        statusCode: 403,
        blocked: true,
      })
    }
    let imgSrc
    if (sender.images.imagePaths.length > 0) {
      imgSrc = sender.images.imagePaths[0].path
    } else {
      imgSrc = 'no-photo.provided.png'
    }

    let recieverImg
    if (receiverOfMessage.images.imagePaths.length > 0) {
      recieverImg = receiverOfMessage.images.imagePaths[0].path
    } else {
      recieverImg = 'no-photo.provided.png'
    }

    const sentMessage = await ProfileService.sendMessageToUser(sender, receiverOfMessage, imgSrc, recieverImg, message)
    if (!sentMessage) {
      return res.status(500).json({
        message: 'There was an error sending the  message!',
      })
    }
    if (receiverOfMessage.random === 'true') {
      ProfileService.sendNewEmail({
        to: 'dwoods447@gmail.com',
        bcc: 'dwoods447@gmail.com',
        from: 'ImSeekingGeeks',
        subject: 'New message recieved on ImSeekingGeeks',
        html: `
                <h1>Hello ${receiverOfMessage.username}, you have a new message from, ${sender.username}</h1>
                <div>
                    <p>Please <a href="https://www.imseekinggeeks.com/login">login</a> to view your message</p>
                </div>
                `,
      })
    } else {
      ProfileService.sendNewEmail({
        to: receiverOfMessage.email,
        bcc: 'dwoods447@gmail.com',
        from: 'mail@imseekinggeeks.com',
        subject: 'New message recieved on ImSeekingGeeks',
        html: `
                  <h1>Hello ${receiverOfMessage.username}, you have a new message from, ${sender.username}</h1>
                  <div>
                      <p>Please <a href="https://www.imseekinggeeks.com/login">login</a> to view your message</p>
                  </div>
                  `,
      })
    }

    return res.status(200).json({
      message: 'Message sent sucessfully!',
      statusCode: 200,
      blocked: false,
    })
  },
  async getInboxMessagesForUser(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const user = await UserService.checkIfUserLoggedIn(req.userId) //
    if (!user) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const totalItems = await ProfileService.getTotalMessageCountForUser(req.userId)
    const authUsersMessages = await ProfileService.getMessagesForAuthenticatedUser(req.userId)
    return res.status(200).json({ messages: authUsersMessages, totalItems: totalItems })
  },
  async getMessagesFromSender(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const loggedInUser = await UserService.checkIfUserIdExists(req.userId)
    if (!loggedInUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const { senderId } = req.params
    const msgSender = await UserService.checkIfUserIdExists(senderId)
    if (!msgSender)
      return res.status(400).json({
        message: "User's account has been removed!",
        deletedAccount: true,
      })
    const messages = await ProfileService.getMessageThreadForUsers(req.userId, senderId)
    return res.status(200).json({ messages: messages, deletedAccount: false })
  },
  async getSentMessagesForUser(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const loggedInUser = await UserService.checkIfUserIdExists(req.userId)
    if (!loggedInUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const mySentMesages = await ProfileService.getSentMessagesForLoggedInUser(req.userId)
    return res.status(200).json({ messages: mySentMesages })
  },
  async getUserProfileViews(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const authorizedUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!authorizedUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const userViews = await UserService.getProfileViews(req.userId)
    if (!userViews)
      return res.status(400).json({
        message: 'Something went wront with the request!',
        views: [],
      })
    return res.status(200).json({ views: userViews })
  },
  async getUsersInBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const authorizedUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!authorizedUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    let usersInBlockList = []
    const blockedUsers = await UserService.getUsersBlockedList(req.userId)
    usersInBlockList = blockedUsers.blockedUsers.users
    return res.status(200).json({ blockList: usersInBlockList })
  },
  async getUsersInFavoriteList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const authorizedUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!authorizedUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    let userInFavoritesList = []
    const users = await UserService.findUsersFavorites(req.userId)
    userInFavoritesList = users.favorites.users
    return res.status(200).json({ favoriteList: userInFavoritesList })
  },
  async getRandomUserForMatchMaker(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    let selectedGenders = []
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    selectedGenders = currentUser.seekingGenders.genders
    const randomMatches = await UserService.getRandomMatchByGender(selectedGenders, req.userId)
    return res.status(200).json({ users: randomMatches })
  },
  async getRandomTenRandomUsers(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    try {
      const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
      if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
      const users = await UserService.getTenRandomUsers(req.userId)
      return res.json({ users: users })
    } catch (err) {
      next(err)
    }
  },
  async addUserToMatchList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    let isMutualMatch = false
    const { userProfileId } = req.body
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Please log in to view favorites' })
    const userToAdd = await UserService.findTargetUserToAddForMatchList(userProfileId)
    if (!userToAdd) return res.status(400).json({ message: 'User you tried to add doesnt exist' })
    await UserService.addUnMatchedToMatchList(currentUser, userToAdd)
    const mutualMatch = await UserService.checkMutalMatch(currentUser, userToAdd)
    if (mutualMatch) {
      isMutualMatch = true
      return res.status(200).json({
        message: 'User added to matches successfully! And is a Mutual Match',
        isMutualMatch: isMutualMatch,
      })
    }
    return res.status(200).json({
      message: 'User added to matches successfully!',
      isMutualMatch: isMutualMatch,
    })
  },

  async addUserToFavorites(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { userProfileId } = req.body
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })

    const userToAdd = await UserService.checkIfUserIdExists(userProfileId)

    if (!userToAdd) return res.status(422).json({ message: 'Unable to locate this account' })

    const userIsFavorited = await UserService.checkIfUserIsAlreadyInFavorites(currentUser, userToAdd)

    if (userIsFavorited) return res.status(400).json({ message: 'User is already in your list of favorites' })

    await UserService.addUserToFavoriteList(currentUser, userToAdd)
    return res.status(200).json({ message: 'User added to favorites successfully!' })
  },
  async removeUserFromFavorites(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { userProfileId } = req.body
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const personToRemove = await UserService.checkIfUserIdExists(userProfileId)
    if (!personToRemove) return res.status(422).json({ message: 'This user was not found' })

    const personRemoved = await UserService.removeUserFromFavoriteList(currentUser, personToRemove)
    if (!personRemoved) return res.status(400).json({ message: 'User could not be removed!' })
    const currentUsersFavs = await UserService.findUsersFavorites(req.userId)
    return res.status(200).json({
      message: 'User successfully removed from favorites',
      favorites: currentUsersFavs.favorites.users,
    })
  },
  async addUserToBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { userToBlockId } = req.body
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })

    const personToBlock = await UserService.checkIfUserIdExists(userToBlockId)
    if (!personToBlock) return res.status(422).json({ message: 'This user was not found' })

    // check if user is blocked before adding
    const userIsBlocked = await UserService.checkIfUserIsBlocked(currentUser, userToBlockId)

    if (userIsBlocked) return res.status(400).json({ message: 'User is already in the list' })

    // if user is not already blocked add to block list
    await UserService.addUserToBlockList(currentUser, personToBlock)
    return res.status(200).json({ message: 'User added to your block list' })
  },
  async removeUserFromBlockList(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { userProfileId } = req.body
    const blocker = await UserService.checkIfUserLoggedIn(req.userId)
    if (!blocker) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const personToUnBlock = await UserService.checkIfUserIdExists(userProfileId)
    if (!personToUnBlock) return res.status(422).json({ message: 'Error retrieving users account' })
    const userUnBlocked = await UserService.removeUserFromBlockList(blocker, personToUnBlock)
    if (!userUnBlocked) return res.status(422).json({ message: 'Error removing user from blockList' })
    const usersBlockList = await UserService.getUsersBlockedList(req.userId)
    return res.status(200).json({
      message: 'User removed from your block list',
      blockList: usersBlockList.blockedUsers.users,
    })
  },

  async retrieveProfile(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const currentlyAuthorizedUser = req.userId
    const targetedUser = req.body.userId
    const currentUser = await UserService.checkIfUserLoggedIn(currentlyAuthorizedUser)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    const targetUser = await UserService.checkIfUserIdExists(targetedUser)
    if (!targetUser) return res.status(422).json({ message: 'User profile could not be found' })
    // Update age
    await UserService.updateUsersAge(targetUser)
    const youblockedUser = await UserService.checkIfUserIsBlocked(currentUser, targetUser)
    const userBlockedYou = await UserService.checkIfUserIsBlocked(targetUser, currentUser)
    if (userBlockedYou === true || youblockedUser === true)
      return res.status(403).json({
        message: `You are prohibited viewing this user's profile`,
        youblockedUser: youblockedUser,
        blocked: true,
        userBlockedYou: userBlockedYou,
      })
    if (req.body.userId !== req.userId) await UserService.addProfileViewer(targetUser, currentUser)
    return res.status(200).json({ message: 'User found', user: targetUser, blocked: false })
  },
  async basicProfileSearch(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    // Get user search parameters
    const searchParams = req.body
    const requestParams = {} as basicUser
    if (searchParams.gender) requestParams.gender = searchParams.gender
    if (searchParams.minAge || searchParams.maxAge)
      requestParams.age = {
        $gte: Number.parseInt(searchParams?.minAge),
        $lte: Number.parseInt(searchParams?.maxAge),
      }
    if (searchParams.minHeight || searchParams.minHeight)
      requestParams.height = {
        $gte: Number.parseInt(searchParams?.minHeight),
        $lte: Number.parseInt(searchParams?.maxHeight),
      }
    if (searchParams.ethnicity) requestParams.ethnicity = { $in: searchParams?.ethnicity }
    if (searchParams.bodyType) requestParams.bodyType = searchParams.bodyType
    if (searchParams.datingIntent) requestParams.datingIntent = searchParams.datingIntent
    if (searchParams.highestEducation) requestParams.highestEducation = searchParams.highestEducation
    if (searchParams.onlineStatus) requestParams.onlineStatus = searchParams.onlineStatus
    if (searchParams.city) requestParams.city = searchParams.city
    if (searchParams.usState) requestParams.state = searchParams.usState
    if (searchParams.usState) requestParams.state = searchParams.usState
    // if (searchParams.miles) requestParams.miles = searchParams.miles

    if (!searchParams.miles)
      return res.status(422).json({
        message: `Incorrect value entered for miles`,
      })
    const zipCodes = await ProfileService.fetchZipCodeData(searchParams.postalCode, searchParams.miles)
    if (!zipCodes) return res.status(404).json({ message: 'No zipcodes returned!' })
    if (zipCodes.error_code === 404) return res.status(404).json({ message: 'You entered an invalid zipcode' })

    if (searchParams.postalCode) requestParams.postalCode = { $in: zipCodes }

    const usersFound = await ProfileService.basicUserSearchQuery(currentUser._id.toString(), requestParams)

    return res.status(200).json({ users: usersFound })
  },

  async advancedProfileSearch(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    // Get user search parameters
    const searchParams = req.body
    const requestParams: advancedUser = {
      gender: null,
      height: { $gte: null, $lte: null },
      age: { $gte: null, $lte: null },
      ethnicity: { $in: null },
      bodyType: null,
      datingIntent: null,
      highestEducation: { $in: null },
      onlineStatus: null,
      city: null,
      state: null,
      postalCode: null,
      miles: null,
      seekingGenders: {
        genders: { $in: null },
      },
      selectedMaritalStatuses: {
        statuses: { $in: null },
      },
      geekInterests: {
        interests: { $in: null },
      },
      relationshipTypeSeeking: null,
      description: null,
      hairColor: null,
      eyeColor: null,
      secondLanguage: null,
      maritalStatus: null,
      hasChildren: null,
      doesSmoke: null,
      doesDoDrugs: null,
      doesDrink: null,
      religion: null,
      doesHavePets: null,
      income: { $gte: null },
      doesDateInteracially: null,
      interacialDatingPreferences: {
        races: { $in: null },
      },
      raceDatingPreferences: {
        races: { $in: null },
      },
    }

    if (searchParams?.gender) requestParams.gender = requestParams.gender
    if (searchParams?.minAge || searchParams?.maxAge)
      requestParams.age = {
        $gte: Number.parseInt(searchParams?.minAge),
        $lte: Number.parseInt(searchParams.maxAge),
      }
    if (searchParams.minHeight || searchParams?.minHeight)
      requestParams.height = {
        $gte: Number.parseInt(searchParams?.minHeight),
        $lte: Number.parseInt(searchParams?.maxHeight),
      }
    if (searchParams?.ethnicity) requestParams.ethnicity = { $in: searchParams?.ethnicity }
    if (searchParams?.bodyType) requestParams.bodyType = searchParams.bodyType
    if (searchParams?.datingIntent) requestParams.datingIntent = searchParams.datingIntent
    if (searchParams?.highestEducation) {
      let educationalBackground
      if (searchParams.highestEducation === 'high school') {
        educationalBackground = ['high school']
      }
      if (searchParams.highestEducation === 'some college') {
        educationalBackground = ['high school', 'some college']
      }
      if (searchParams.highestEducation === 'some university') {
        educationalBackground = ['high school', 'some college', 'some university']
      }
      if (searchParams.highestEducation === 'associates degree') {
        educationalBackground = ['high school', 'some college', 'some university', 'associates degree']
      }
      if (searchParams.highestEducation === 'bachelors degree') {
        educationalBackground = [
          'high school',
          'some college',
          'some university',
          'associates degree',
          'bachelors degree',
        ]
      }
      if (searchParams.highestEducation === 'bachelors degree') {
        educationalBackground = [
          'high school',
          'some college',
          'some university',
          'associates degree',
          'bachelors degree',
        ]
      }
      if (searchParams.highestEducation === 'masters degree') {
        educationalBackground = [
          'high school',
          'some college',
          'some university',
          'associates degree',
          'bachelors degree',
          'masters degree',
        ]
      }
      if (searchParams.highestEducation === 'phd/post doctoral') {
        educationalBackground = [
          'high school',
          'some college',
          'some university',
          'associates degree',
          'bachelors degree',
          'masters degree',
          'phd/post doctoral',
        ]
      }
      searchParams.highestEducation = { $in: educationalBackground }
    }
    if (searchParams?.onlineStatus) requestParams.onlineStatus = searchParams.onlineStatus
    if (searchParams?.city) requestParams.city = searchParams.city
    if (searchParams?.usState) requestParams.state = searchParams.usState

    if (searchParams.city) requestParams.city = searchParams.city
    if (searchParams.usState) requestParams.state = searchParams.usState
    if (searchParams.martialStatus) requestParams.maritalStatus = { $in: searchParams.maritalStatus }
    if (searchParams.hasChildren) requestParams.hasChildren = searchParams.hasChildren
    if (searchParams.doesSmoke) requestParams.doesSmoke = searchParams.doesSmoke
    if (searchParams.doesDoDrugs) requestParams.doesDoDrugs = searchParams.doesDoDrugs
    if (searchParams.doesDrink) requestParams.doesDrink = searchParams.doesDrink
    if (searchParams.religion.length > 0) requestParams.religion = { $in: searchParams.religion }
    if (searchParams.doesHavePets) requestParams.doesHavePets = searchParams.doesHavePets
    if (searchParams.income)
      requestParams.income = {
        $gte: Number.parseInt(searchParams.income),
      }
    if (searchParams.doesDateInteracially) requestParams.doesDateInteracially = searchParams.doesDateInteracially
    if (searchParams.doesDateInteracially && searchParams.interacialDatingPreferences.length > 0) {
      const interracialPreference = {
        'interacialDatingPreferences.races': {
          $in: searchParams.interacialDatingPreferences,
        },
      }

      Object.assign(requestParams, interracialPreference)
    }
    if (searchParams.raceDatingPreferences.length > 0) {
      const datingPreference = {
        'raceDatingPreferences.races': {
          $in: searchParams.raceDatingPreferences,
        },
      }
      Object.assign(requestParams, datingPreference)
    }

    const zipCodes = await ProfileService.fetchZipCodeData(searchParams.postalCode, requestParams.miles)
    if (!zipCodes) return res.status(404).json({ message: 'No zipcodes returned!' })
    if (zipCodes.error_code === 404) return res.status(404).json({ message: 'You entered an invalid zipcode' })

    if (searchParams.postalCode) requestParams.postalCode = { $in: zipCodes }

    const searchedUsers = await ProfileService.advancedUserSearchQuery(currentUser._id.toString(), requestParams)

    return res.status(200).json({ users: searchedUsers })
  },
  async markMessageAsRead(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { messageId } = req.body

    const message = await ProfileService.findMessage(messageId)
    await ProfileService.markMessageAsRead(message)
  },
  async deleteUserProfile(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const user = await UserService.checkIfUserIdExists(req.userId)
    user.images.imagePaths.forEach((image: { path: string }) => {
      const imgPth = path.join(__dirname + '/./../../static/uploads/', image.path)
      try {
        fs.unlinkSync(imgPth)
      } catch (err) {
        console.error(`Error deleting file: ${err}`)
      }
    })
    let emptyImages = [...user.images.imagePaths]
    emptyImages = []
    user.images.imagePaths = emptyImages
    const userSaved = await user.save()
    if (userSaved) {
      const userDeleted = await UserService.deleteUser(req.userId)
      if (userDeleted) {
        return res.json({ message: 'Account succesfully deleted' })
      } else {
        return res.status(500).json({
          message: 'There was an error while trying to remove your account',
        })
      }
    }
  },
  async deleteImage(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const user = await UserService.checkIfUserIdExists(req.userId)
    const { imageId } = req.body
    const imageRemoved = await user.removeImageFromProfile(imageId)
    if (!imageRemoved) {
      return res.status(422).json({ message: 'There was an error removing the image.' })
    }
    return res.status(200).json({
      message: 'Image removed successfully',
      images: user.images.imagePaths,
    })
  },
  async uploadImage(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const currentUser = await UserService.checkIfUserLoggedIn(req.userId)
    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized you are not logged in!' })
    }
    if (!req.file) {
      const error = new Error('No image provided')
      return res.status(422).json({ message: error })
    }
    const imgLength = currentUser.images.imagePaths.length
    if (imgLength >= 5)
      res.status(422).json({
        message: 'You have exceeded the limit to the number of images you can upload',
      })
    const imageUrl = req.file.filename
    const imageUploaded = await currentUser.addImageToProfile(imageUrl)
    if (!imageUploaded)
      return res.status(422).json({
        message: 'You have exceeded the limit to the number of images you can upload',
      })

    return res.status(200).json({ message: 'Image uploaded successfully', currentUser })
  },
  async usernameLookUp(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const { username } = req.body
    const user = await UserService.checkUserNameExists(username)
    if (!user) {
      return res.status(422).json({ message: 'No user with that username found!' })
    }
    return res.status(422).json({ user })
  },
  async updateExtendedUserProfile(req: ExtendedRequest, res: ExtendedResponse, next: ExtendedNextFunction) {
    const {
      seekingGenders,
      height,
      relationshipTypeSeeking,
      hairColor,
      eyeColor,
      highestEducation,
      secondLanguage,
      bodyType,
      postalCode,
      usState,
      city,
      maritalStatus,
      hasChildren,
      description,
      doesSmoke,
      doesDoDrugs,
      doesDrink,
      religion,
      profession,
      doesHavePets,
      personality,
      ambitiousness,
      datingIntent,
      longestRelationShip,
      income,
      doesDateInteracially,
      interacialDatingPreferences,
      raceDatingPreferences,
      geekInterests,
      selectedMaritalStatuses,
    } = req.body

    const user = await UserService.checkIfUserIdExists(req.userId)
    if (!user) {
      return res.status(422).json({ message: 'No user found' })
    }

    if (height) user.height = height
    if (relationshipTypeSeeking) user.relationshipTypeSeeking = relationshipTypeSeeking
    if (hairColor) user.hairColor = hairColor
    if (eyeColor) user.eyeColor = eyeColor
    if (highestEducation) user.highestEducation = highestEducation
    if (secondLanguage) user.secondLanguage = secondLanguage
    if (bodyType) user.bodyType = bodyType
    if (postalCode) user.postalCode = postalCode
    if (usState) user.state = usState
    if (city) user.city = city
    if (description) user.description = description
    if (maritalStatus) user.maritalStatus = maritalStatus
    if (hasChildren !== '') user.hasChildren = hasChildren
    if (doesSmoke !== '') user.doesSmoke = doesSmoke
    if (doesDoDrugs !== '') user.doesDoDrugs = doesDoDrugs
    if (doesDrink !== '') user.doesDrink = doesDrink
    if (religion) user.religion = religion
    if (profession) user.profession = profession
    if (doesHavePets !== '') user.doesHavePets = doesHavePets
    if (personality) user.personality = personality
    if (ambitiousness) user.ambitiousness = ambitiousness
    if (datingIntent) user.datingIntent = datingIntent
    if (longestRelationShip) user.longestRelationShip = longestRelationShip
    if (income) user.income = income
    if (doesDateInteracially !== '') user.doesDateInteracially = doesDateInteracially
    if (doesDateInteracially === true && interacialDatingPreferences) {
      if (interacialDatingPreferences.length > 0) {
        user.interacialDatingPreferences.races = interacialDatingPreferences
      }
    }
    if (raceDatingPreferences) {
      if (raceDatingPreferences.length > 0) {
        user.raceDatingPreferences.races = raceDatingPreferences
      }
    }
    if (geekInterests) {
      if (geekInterests.length > 0) {
        user.geekInterests.interests = geekInterests
      }
    }
    if (selectedMaritalStatuses) {
      if (selectedMaritalStatuses.length > 0) {
        user.selectedMaritalStatuses.statuses = selectedMaritalStatuses
      }
    }
    if (seekingGenders) {
      if (seekingGenders.length > 0) {
        user.seekingGenders.genders = seekingGenders
      }
    }
    user.isProfileCompleted = true
    const savedUser = await user.save()
    if (!savedUser) {
      return res.status(422).json({ message: 'There was an error saving the profile' })
    }
    return res.status(200).json({
      message: 'User Profile updated successfully!',
      user: savedUser,
    })
  },
}

export default ProfileController
