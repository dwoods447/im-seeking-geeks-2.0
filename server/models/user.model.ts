import fs from 'fs'
import path from 'path'
import { DateTime, Duration } from 'luxon'
import { Schema, Model, model, Types } from 'mongoose'
import { UserType, UserTypeMethods } from '../types/users.js'

import bcrypt from 'bcryptjs'
import { MessageType } from 'types/messages.js'

type UserModel = Model<UserType, {}, UserTypeMethods>
const UserSchema = new Schema<UserType, UserModel, UserTypeMethods>({
  random: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  ethnicity: {
    type: String,
    required: true,
  },
  onlineStatus: {
    type: Boolean,
  },
  seekingGenders: {
    genders: [],
  },
  selectedMaritalStatuses: {
    statuses: [],
  },
  geekInterests: {
    interests: [],
  },
  height: {
    type: Number,
  },
  relationshipTypeSeeking: {
    type: String,
  },
  description: {
    type: String,
  },
  hairColor: {
    type: String,
  },
  eyeColor: {
    type: String,
  },
  highestEducation: {
    type: String,
  },
  secondLanguage: {
    type: String,
  },
  bodyType: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  hasChildren: {
    type: Boolean,
  },
  doesSmoke: {
    type: Boolean,
  },
  doesDoDrugs: {
    type: Boolean,
  },
  doesDrink: {
    type: Boolean,
  },
  religion: {
    type: String,
  },
  profession: {
    type: String,
  },
  doesHavePets: {
    type: Boolean,
  },
  personality: {
    type: String,
  },
  ambitiousness: {
    type: String,
  },
  datingIntent: {
    type: String,
  },
  longestRelationShip: {
    type: String,
  },
  income: {
    type: Number,
  },
  doesDateInteracially: {
    type: Boolean,
  },
  interacialDatingPreferences: {
    races: [],
  },
  raceDatingPreferences: {
    races: [],
  },
  profileViews: {
    views: [],
  },
  favorites: {
    users: [],
  },
  blockedUsers: {
    users: [],
  },
  userMatches: {
    matches: [],
  },
  images: {
    imagePaths: [],
  },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.hash(this.password, 12, (err: Error, hash: string) => {
    if (err) return next(err)
    this.password = hash
    next()
  })
})
/*
UserSchema.methods.comparePassword  = async function name(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password).catch((e) => false)
}
*/
UserSchema.methods.addUserToMatchList = function (user): Promise<UserType | undefined> {
  const userMatchListIndex: number = this.userMatches.matches.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })
  const updatedMatchList = [...this.userMatches.matches]

  // User is in matchList list DONT add them
  if (userMatchListIndex !== -1) return

  // User is not in matches add them
  updatedMatchList.push({
    userId: user._id.toString(),
  })
  this.userMatches.matches = updatedMatchList
  return this.save()
}

UserSchema.methods.addUserToFavorites = function (user): Promise<UserType | undefined> {
  const userFavoriteIndex: number = this.favorites.users.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })
  const updatedFavorites: Array<{ userId: string }> = [...this.favorites.users]
  // User is already in favorites list DONT add them
  if (userFavoriteIndex !== -1) return
  // User is not in favorites add them
  updatedFavorites.push({
    userId: user._id.toString(),
  })
  this.favorites.users = updatedFavorites
  return this.save()
}

UserSchema.methods.checkIfUserIsMutualMatch = function (user) {
  const userMatchIndex: number = this.userMatches.matches.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })
  // User is already in match list
  if (userMatchIndex !== -1) return true

  return false
}

UserSchema.methods.checkIfUserIsAlreadyInFavorites = function (user): boolean {
  const userFavoriteIndex: number = this.favorites.users.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })

  return userFavoriteIndex !== -1 ? true : false
}

UserSchema.methods.removeUserFromFavorites = function (user): boolean {
  const userFavoriteIndex: number = this.favorites.users.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })

  const updatedFavorites: Array<{ userId: string }> = [...this.favorites.users]
  // User was not found the list of favorites
  if (userFavoriteIndex === -1) return false

  updatedFavorites.splice(userFavoriteIndex, 1)

  const newFavorites = updatedFavorites
  this.favorites.users = newFavorites
  this.save()
  // User was found the list of favorites and removed
  return true
}

UserSchema.methods.removeUserFromBlockList = function (user): boolean {
  const userBlockedIndex: number = this.blockedUsers.users.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })
  const updatedBlockedUsers: Array<{ userId: string }> = [...this.blockedUsers.users]
  // User is not in the block list
  if (userBlockedIndex === -1) return false

  // User is in blocked user list remove them
  updatedBlockedUsers.splice(userBlockedIndex, 1)
  const newBlockList = updatedBlockedUsers
  this.blockedUsers.users = newBlockList
  this.save()
  return true
}

UserSchema.methods.addProfileViewer = function (user) {
  const today = new Date()
  const userProfileIndex: number = this.profileViews.views.findIndex((searchedViews: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedViews.userId.toString()
  })

  const updatedProfileViews: Array<{ userId: string; date: Date }> = [...this.profileViews.views]
  // User is in the list of profile viewers do not add them
  if (userProfileIndex !== -1) return
  // User is not in list of profile viewers add them
  updatedProfileViews.push({
    userId: user._id.toString(),
    date: today,
  })

  this.profileViews.views = updatedProfileViews

  return this.save()
}

UserSchema.methods.checkIfUserIsBlocked = function (user) {
  const userBlockedIndex = this.blockedUsers.users.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })

  return userBlockedIndex !== -1 ? true : false
}

UserSchema.methods.addUserToBlockList = function (user) {
  const userBlockedIndex: number = this.blockedUsers.users.findIndex((searchedUser: { userId: Types.ObjectId }) => {
    return user._id.toString() === searchedUser.userId.toString()
  })
  // User is already in blocked user list do not add them
  if (userBlockedIndex !== -1) return

  const updatedBlockedUsers = [...this.blockedUsers.users]
  // User is not in block user list add them
  updatedBlockedUsers.push({
    userId: user._id.toString(),
  })

  const newBlockList = {
    users: updatedBlockedUsers,
  }
  this.blockedUsers = newBlockList
  return this.save()
}

UserSchema.methods.sendMessageToUserInbox = function (sender, message) {
  const updatedMessages = [...this.inbox.messages]
  updatedMessages.push({
    messageId: new Types.ObjectId(),
    from: sender._id,
    content: message,
    date: new Date(),
  })
  this.inbox.messages = updatedMessages
  return this.save()
}

UserSchema.methods.removeMessageFromUserInbox = function (message: MessageType) {
  const userInboxMessages = this.inbox.message.filter((msg: MessageType) => {
    return msg._id.toString() !== message._id.toString()
  })
  this.inbox.messages = userInboxMessages
  return this.save()
}
UserSchema.methods.addImageToProfile = async function (imagePath: string) {
  const updatedImages = [...this.images.imagePaths]
  if (updatedImages.length >= 4) return false
  updatedImages.push({
    imageId: new Types.ObjectId(),
    path: imagePath,
    date: new Date(),
  })
  this.images.imagePaths = updatedImages
  await this.save()
  return true
}

UserSchema.methods.removeImageFromProfile = function (targetImg) {
  const updatedImages = [...this.images.imagePaths]
  const foundImage = updatedImages.find(({ imageId }) => {
    return imageId == targetImg
  })
  if (!foundImage) return // image does not exist
  const imgPth = path.join(__dirname + '/./../../static/uploads/', foundImage.path)
  try {
    fs.unlinkSync(imgPth)
  } catch (err) {
    console.error(`Error deleting file: ${err}`)
  }
  const userImages = updatedImages.filter((image) => {
    return image.imageId != targetImg
  })

  const newImages = [...userImages]
  this.images.imagePaths = newImages
  return this.save()
}

UserSchema.methods.clearAllMessagesFromInbox = function () {
  this.inbox = { messages: [] }
  return this.save()
}

UserSchema.methods.updateUserAge = async function () {
  // let age = this.age
  // age = moment(new Date(), 'MM/DD/YYYY').diff(moment(this.birthdate, 'MM/DD/YYYY'), 'years')
  const now = DateTime.now()
  const birthDate = DateTime.fromJSDate(this.birthdate)
  const age = now.diff(birthDate).years
  this.age = age
  await this.save()
}

UserSchema.methods.getRandomArbitrary = function (min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min)
}

const User = model('User', UserSchema)
export default User
