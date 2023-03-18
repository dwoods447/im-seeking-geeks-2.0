import { Types } from 'mongoose'
import { MessageType } from './messages'

type UsersIdType = {
  users: Array<{
    type: { userId: Types.ObjectId; ref: string }
    date: { type: Date }
  }>
}
type ViewsIdType = {
  views: Array<{
    type: { userId: Types.ObjectId; ref: string }
    date: { type: Date }
  }>
}
type MatchesIdType = {
  matches: Array<
    | {
        type: { userId: Types.ObjectId; ref: string }
        date: { type: Date }
      }
    | []
  >
}

type ImagesType = {
  imagePaths: Array<{
    imageId: { type: Types.ObjectId }
    path: string
    date: { type: Date }
  }>
}

export interface UserType {
  _id: Types.ObjectId
  random: string
  username: string
  password: string
  resetToken?: string
  resetTokenExpiration?: Date
  email: string
  gender: string
  birthdate: Date
  age: number
  ethnicity: string
  onlineStatus: boolean
  seekingGenders?: {
    genders: string[]
  }
  selectedMaritalStatuses?: {
    statuses: string[]
  }
  geekInterests?: {
    interests: string[]
  }
  height: number
  relationshipTypeSeeking: string
  description: string
  hairColor?: string
  eyeColor?: string
  highestEducation?: string
  secondLanguage?: string
  bodyType?: string
  postalCode: string
  city: string
  state: string
  maritalStatus: string
  hasChildren?: boolean
  doesSmoke?: boolean
  doesDoDrugs?: boolean
  doesDrink?: boolean
  religion?: string
  profession?: string
  doesHavePets?: boolean
  personality?: string
  ambitiousness?: string
  datingIntent: string
  longestRelationShip?: string
  income: number
  doesDateInteracially: boolean
  interacialDatingPreferences?: {
    races: string[]
  }
  raceDatingPreferences?: {
    races: string[]
  }
  userMatches: MatchesIdType
  blockedUsers: UsersIdType
  favorites: UsersIdType
  profileViews: ViewsIdType

  images: ImagesType
  isProfileCompleted?: boolean
  isPremiumUser?: boolean
  updateUserAge(): Promise<void>
  removeImageFromProfile(targetImg: string): UserType
  sendMessageToUserInbox(sender: UserType, message: string): UserType
  removeMessageFromUserInbox(message: MessageType): UserType
  clearAllMessagesFromInbox(): UserType
  checkIfUserIsBlocked(user: UserType): boolean
  checkIfUserIsAlreadyInFavorites(user: UserType): boolean
  checkIfUserIsMutualMatch(user: UserType): boolean
  addUserToFavorites(user: UserType): Promise<UserType | undefined>
  addUserToMatchList(user: UserType): Promise<UserType | undefined>
  addUserToBlockList(user: UserType): UserType
  addImageToProfile(imagePath: string): Promise<boolean>
  addProfileViewer(user: UserType): Promise<UserType | undefined>
  removeUserFromFavorites(user: UserType): boolean
  removeUserFromBlockList(user: UserType): boolean
  save(): Promise<any>
}

export interface UserTypeMethods {
  updateUserAge(): Promise<void>
  removeImageFromProfile(targetImg: string): UserType
  sendMessageToUserInbox(sender: UserType, message: string): UserType
  removeMessageFromUserInbox(message: MessageType): UserType
  clearAllMessagesFromInbox(): UserType
  checkIfUserIsBlocked(user: UserType): boolean
  checkIfUserIsAlreadyInFavorites(user: UserType): boolean
  checkIfUserIsMutualMatch(user: UserType): boolean
  addUserToFavorites(user: UserType): Promise<UserType | undefined>
  addUserToMatchList(user: UserType): Promise<UserType | undefined>
  addUserToBlockList(user: UserType): UserType
  addImageToProfile(imagePath: string): Promise<boolean>
  addProfileViewer(user: UserType): Promise<UserType | undefined>
  removeUserFromFavorites(user: UserType): boolean
  removeUserFromBlockList(user: UserType): boolean
}

export interface basicUser {
  gender?: string
  height?: { $gte: number; $lte: number }
  age?: { $gte: number; $lte: number }
  ethnicity?: { $in: string }
  bodyType?: string
  datingIntent?: string
  highestEducation?: string
  onlineStatus?: boolean
  city?: string
  state?: string
  postalCode: { $in: string; error_code?: number | null }
  miles: string
}

export interface advancedUser {
  gender: string
  height: { $gte: number; $lte: number }
  age: { $gte: number; $lte: number }
  ethnicity: { $in: string }
  bodyType?: string
  datingIntent: string
  highestEducation?: { $in: string }
  onlineStatus: boolean
  city: string
  state: string
  postalCode: { $in: string; error_code?: number | null }
  miles: string
  seekingGenders?: {
    genders: { $in: string }
  }
  selectedMaritalStatuses?: {
    statuses: { $in: string }
  }
  geekInterests?: {
    interests: { $in: string }
  }
  relationshipTypeSeeking: string
  description: string
  hairColor?: string
  eyeColor?: string
  secondLanguage?: string
  maritalStatus: { $in: string }
  hasChildren?: boolean
  doesSmoke?: boolean
  doesDoDrugs?: boolean
  doesDrink?: boolean
  religion?: { $in: string }
  doesHavePets?: boolean
  income: { $gte: number }
  doesDateInteracially: boolean
  interacialDatingPreferences?: {
    races: { $in: string }
  }
  raceDatingPreferences?: {
    races: { $in: string }
  }
}
