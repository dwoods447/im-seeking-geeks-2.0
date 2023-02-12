import User from '../models/user.model.js'

const UserService = {

 async checkUserNameExists(username: string) {

    try {

        const userName = await User.findOne({ username })

        return userName

    } catch(error: any){

        throw new Error(error)

    }

 },

 async checkEmailExists(email: string){

    try {

        const userEmail = await User.findOne({ email })

        return userEmail

    } catch(error: any){

        throw new Error(error)

    }

 },

 async createNewUser(username:string, email:string, password:string, gender:string, birthdate:string, ethnicity:string){

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
 
 async checkIfUserLoggedIn(userId: string){
    const user = await User.findOne({ _id: userId })
    return user
 }
}

export default UserService