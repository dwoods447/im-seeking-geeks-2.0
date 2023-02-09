import { Schema, model } from 'mongoose'
import { UserType } from '../types/users.js'
import bcrypt from 'bcryptjs'


const UserSchema = new Schema<UserType>({
  random: {
    type: String,
    required: true
},
  username: {
    type: String,
    required: true
},
  password: {
    type: String,
    required: true
},
  resetToken: {
    type: String
 },
  resetTokenExpiration: {
    type: Date
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
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.hash(this.password, 12, (err:Error, hash:string) => {
    if (err) return next(err)
    this.password = hash
    next()
  })
})

UserSchema.methods.comparePassword  = async function name(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password).catch((e) => false)
}

  const User = model('User', UserSchema)
  export default User