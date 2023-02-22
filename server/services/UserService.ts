import User from '../models/user.model.js'
import { UserType } from 'types/users.js'
import { Document } from 'mongoose'


const UserService = {
 async checkIfUserIdExists(userId: string) : Promise<UserType | null>{
    try{
      const user = await User.findOne({_id: userId })
      return user
    }catch(error){
        throw new Error(error)
    }
 },
 async checkUserNameExists(username: string) : Promise<UserType | null> {

    try {
        const userName = await User.findOne({ username })
        return userName
    } catch(error){
        throw new Error(error)
    }

 },

 async checkEmailExists(email: string) : Promise<UserType | null>{

    try {

        const userEmail = await User.findOne({ email })

        return userEmail

    } catch(error: any){

        throw new Error(error)

    }

 },

 async createNewUser(username:string, email:string, password:string, gender:string, birthdate:string, ethnicity:string) : Promise<UserType | null>{

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

          })

          return await newUser.save()

    }catch(error: any){

        throw new Error(error)

    }

 },
 
 async checkIfUserLoggedIn(userId: string) : Promise<UserType | null>{
    try {
        const user = await User.findOne({ _id: userId })
        return user
    } catch (error) {
        throw new Error(error)
    }
 },

 async getProfileViews(userId: string){
    try {
     const views = await User.findOne({ _id: userId }).populate({ path: 'profileViews.views.userId', select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'] }).select(['-password'])
     return views.profileViews.views
    } catch (error) {
        throw new Error(error)
    }
 },

 async findUsersInBlockedList(userId: string) : Promise<UserType | null>{
    try {
        const users = await User.findById(userId).populate({ path: 'blockedUsers.users.userId', select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'] })
        return users
       } catch (error) {
           throw new Error(error)
       }
  },

async findUsersFavorites(userId: string) : Promise<UserType | null>{
    try {
        const user = await User.findById(userId).populate({ path: 'favorites.users.userId', select: ['random', 'gender', 'username', 'onlineStatus', 'images.imagePaths'] })
        return user
      } catch (error) {
        throw new Error(error)
    }
 } , 
 
 async getRandomMatchByGender(selectedGenders: string[], currentUser:string) {
    const users = await User.aggregate([
        {
            $match: { gender: { $in: selectedGenders } }
        },
        { $sample: { size: 1 } },
        { $project: { password: 0 } }
        ])
        const matches = users.filter((user: UserType) => {
            if(user._id.toString() !== currentUser) return user
        })

        return users
 },

 async getTenRandomUsers(userId: string) : Promise<UserType[] | []>{
    try {
        const filter = {}
        const users = await User.aggregate([
          {  $sample: { size: 10 } }
        ])

        const userToReturn = users.filter((user: UserType) => {
            return user._id.toString() !== userId
        }) 
       return users
      }catch(error){
        throw new Error(error)
      }
 },

 async findTargetUserToAddForMatchList(targetUserId: string){
      try {
        const targetUser = await User.findById(targetUserId)
        return targetUser
      } catch(error){
        throw new Error(error)
      }
 },
 async addUnMatchedToMatchList(currentUser: UserType, targetUser: UserType){
      try {
        const matchList = currentUser.addUserToMatchList(targetUser)
        return matchList
       }catch(error){
        throw new Error(error)
       }
 },
 async checkMutalMatch(targetUser: UserType, currentUser: UserType){
    try {
        const isMutualMatch = targetUser.checkIfUserIsMutualMatch(currentUser)
        return isMutualMatch
      } catch(error){
        throw new Error(error)
    }
 },
}

export default UserService