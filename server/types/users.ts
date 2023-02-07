export interface UserType {
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
    hairColor: string,
    eyeColor:string,
    highestEducation:string,
    secondLanguage: string,
    bodyType:string,
    postalCode: string,
    city: string,
    state: string,
    maritalStatus:string,
    hasChildren?: boolean,
    doesSmoke?: boolean,
    doesDoDrugs?: boolean,
    doesDrink?: boolean,
    religion?: string,
    profession: string,
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
    isProfileCompleted: boolean,
    isPremiumUser: boolean,
    comparePassword(candidatePassword:string): Promise<boolean>
 }