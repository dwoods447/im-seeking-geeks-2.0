import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
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
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err)
            return next(err);
        this.password = hash;
        next();
    });
});
/*
UserSchema.methods.comparePassword  = async function name(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password).catch((e) => false)
}
*/
UserSchema.methods.addUserToMatchList = function (user) {
    const userMatchListIndex = this.userMatches.matches.findIndex((searchedUser) => {
        return user._id.toString() === searchedUser.userId.toString();
    });
    const updatedMatchList = [...this.userMatches.matches];
    if (userMatchListIndex === -1) {
        // User is not in matches add them
        updatedMatchList.push({
            user
        });
    }
    else {
        // User is in matchList list DONT add them
        return;
    }
    this.userMatches.matches = updatedMatchList;
    return this.save();
};
UserSchema.methods.checkIfUserIsMutualMatch = function (user) {
    const userMatchIndex = this.userMatches.matches.findIndex((searchedUser) => {
        return user._id.toString() === searchedUser.userId.toString();
    });
    if (userMatchIndex !== -1) {
        // User is already in match list
        return true;
    }
    return false;
};
const User = model('User', UserSchema);
export default User;
//# sourceMappingURL=user.model.js.map