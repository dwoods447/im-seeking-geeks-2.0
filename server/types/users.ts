import { Document, Types } from 'mongoose'
import { MessageType } from './messages'
export interface UserType {
    _id: Types.ObjectId,
    random: string,
    username: string,
    password: string,
    resetToken?:string,
    resetTokenExpiration?:Date,
    email: string,
    gender: string,
    birthdate: Date,
    age: number,
    ethnicity:string,
    onlineStatus:boolean,
    seekingGenders? : {
        genders: string[],
    },
    selectedMaritalStatuses?: {
        statuses: string[]
    },
    geekInterests?: {
        interests: string[]
    },
    height: number,
    relationshipTypeSeeking: string,
    description: string,
    hairColor?: string,
    eyeColor?:string,
    highestEducation?:string,
    secondLanguage?: string,
    bodyType?:string,
    postalCode: string,
    city: string,
    state: string,
    maritalStatus:string,
    hasChildren?: boolean,
    doesSmoke?: boolean,
    doesDoDrugs?: boolean,
    doesDrink?: boolean,
    religion?: string,
    profession?: string,
    doesHavePets?: boolean,
    personality?: string,
    ambitiousness?:string,
    datingIntent: string,
    longestRelationShip?: string,
    income: number,
    doesDateInteracially: boolean,
    interacialDatingPreferences?: {
      races: string[]
    },
    raceDatingPreferences?: {
        races: string[]
    },
    userMatches: {
        matches: [
          {
            userId: { type: Types.ObjectId, ref: 'User' }
          }
        ]
    },
    blockedUsers: {
        users: [
            {
              userId: { type: Types.ObjectId, ref: 'User' }
            }
        ]
    },
    favorites: {
        users: [
          {
            userId: { type: Types.ObjectId, ref: 'User'}
          }
        ]
    },
    profileViews: {
        views: [
          {
            userId: { type: Types.ObjectId, ref: 'User' },
            date: { type: Date }
          }
        ]
    },
    images: {
        imagePaths: [
          {
            imageId: { type: Types.ObjectId },
            path: { type: string },
            date: { type: Date }
          }
        ]
    },
    isProfileCompleted?: boolean,
    isPremiumUser?: boolean,
    removeImageFromProfile(targetImg: string): UserType,
    sendMessageToUserInbox(sender: UserType, message: string): UserType,
    removeMessageFromUserInbox(message: MessageType): UserType,
    clearAllMessagesFromInbox(): UserType,
    checkIfUserIsBlocked(userId: string): UserType,
    checkIfUserIsAlreadyInFavorites(userId: string): UserType,
    checkIfUserIsMutualMatch(user: UserType): boolean,
    addUserToFavorites(user: UserType): UserType,
    addUserToMatchList(user: UserType) : Promise<UserType | undefined>,
    addUserToBlockList (userId: string): UserType,
    addImageToProfile(): UserType,
    addProfileViewer (userId: string): UserType,
    removeUserFromFavorites(user: UserType): UserType,
    removeUserFromBlockList(user: UserType): UserType,
 }


 export interface UserTypeMethods {
   removeImageFromProfile(targetImg: string): UserType,
   sendMessageToUserInbox(sender: UserType, message: string): UserType,
   removeMessageFromUserInbox(message: MessageType): UserType,
   clearAllMessagesFromInbox(): UserType,
   checkIfUserIsBlocked(userId: string): UserType,
   checkIfUserIsAlreadyInFavorites(userId: string): UserType,
   checkIfUserIsMutualMatch(user: UserType): boolean,
   addUserToFavorites(user: UserType): UserType,
   addUserToMatchList(user: UserType) : Promise<UserType | undefined>,
   addUserToBlockList (userId: string): UserType,
   addImageToProfile(): UserType,
   addProfileViewer (userId: string): UserType,
   removeUserFromFavorites(user: UserType): UserType,
   removeUserFromBlockList(user: UserType): UserType,
 }