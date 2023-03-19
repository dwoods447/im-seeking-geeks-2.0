import { faker} from '@faker-js/faker/locale/en_US'
import { Types } from 'mongoose'
import { UserType } from '../../types/users'
import User from '../../models/user.model.js'
import bcrypt from 'bcryptjs'
import { DateTime, Duration } from 'luxon'



export const userOneId = new Types.ObjectId()
export const userTwoId = new Types.ObjectId()

export const residentialState = faker.address.stateAbbr()

export const currentUser = new User({
    _id: userOneId,
    random: 'false',
    username: faker.internet.userName(),
    email: 'user@email.com',
    password: 'password',
    gender: faker.helpers.arrayElement([
        'male',
        'female',
        'trans-male',
        'trans-female'
    ]),
    birthdate: new Date(),
    age: 22,
    ethnicity: faker.helpers.arrayElement([
        'Black/African American',
        'White/Caucasian',
        'Hispanic',
        'Indian',
        'Middle Eastern',
        'Native American',
        'Asian',
        'Mixed Race',
        'Other'
    ]),
    seekingGenders: {
        genders: ['female']
    },
    onlineStatus: faker.datatype.boolean(),
    height: faker.datatype.number({ min: 48, max: 95 }),
    description: '',
    postalCode: faker.address.zipCodeByState(residentialState),
    city: faker.address.city(),
    state: residentialState,
    maritalStatus: faker.helpers.arrayElement([
        'single',
        'married - interested in having an affair',
        'widowed',
        'divorced'
    ]),
    income: 2000,
    datingIntent: '',
    relationshipTypeSeeking: faker.helpers.arrayElement([
        'male',
        'female',
        'trans-male',
        'trans-female'
    ]),
    doesDateInteracially: faker.datatype.boolean()
})

export const targetUser = new User({
    _id: userTwoId,
    random: 'false',
    username: faker.internet.userName(),
    email: 'user@email.com',
    password: 'password',
    gender: faker.helpers.arrayElement([
        'male',
        'female',
        'trans-male',
        'trans-female'
    ]),
    birthdate: new Date(),
    age: 22,
    ethnicity: faker.helpers.arrayElement([
        'Black/African American',
        'White/Caucasian',
        'Hispanic',
        'Indian',
        'Middle Eastern',
        'Native American',
        'Asian',
        'Mixed Race',
        'Other'
    ]),
    onlineStatus: faker.datatype.boolean(),
    height: faker.datatype.number({ min: 48, max: 95 }),
    description: '',
    postalCode: faker.address.zipCodeByState(residentialState),
    city: faker.address.city(),
    state: residentialState,
    maritalStatus: faker.helpers.arrayElement([
        'single',
        'married - interested in having an affair',
        'widowed',
        'divorced'
    ]),
    income: 2000,
    datingIntent: '',
    relationshipTypeSeeking: faker.helpers.arrayElement([
        'male',
        'female',
        'trans-male',
        'trans-female'
    ]),
    doesDateInteracially: faker.datatype.boolean()
})

export const populateDatingPreferences = () => { 
    let preference
    let preferences: string[] = []
      
    for (let i = 0; i < 3; i++) { 
            preference = faker.helpers.arrayElement([
                'Black/African American',
                'White/Caucasian',
                'Hispanic',
                'Indian',
                'Middle Eastern',
                'Native American',
                'Asian',
                'Mixed Race',
                'Other'
        ])
        if (preferences.indexOf(preference) === -1) { 
            preferences.push(preference)
        }
    }
    return preferences
}

export const createUser = () => {
    faker.setLocale('en_US');
    const usState = faker.address.stateAbbr().toString()
    const doesDateInteracially = faker.datatype.boolean()
    const datingPrefs = populateDatingPreferences()
    const generatedAge = faker.datatype.number({ min: 20, max: 44 })
    const yrs = Duration.fromObject({ years: generatedAge, hours: 6}, { conversionAccuracy: 'longterm' })
    const birthDate = DateTime.now().minus(yrs).toISODate()
    return new User({
        _id: new Types.ObjectId(),
        random: 'true',
        username: faker.internet.userName(),
        email: 'user@email.com',
        password: bcrypt.hashSync('password', 12),
        gender: faker.helpers.arrayElement([
            'male',
            'female',
            'trans-male',
            'trans-female'
        ]),
        birthdate: birthDate,
        age: generatedAge,
        ethnicity: faker.helpers.arrayElement([
            'Black/African American',
            'White/Caucasian',
            'Hispanic',
            'Indian',
            'Middle Eastern',
            'Native American',
            'Asian',
            'Mixed Race',
            'Other'
        ]),
        seekingGenders: {
            genders: faker.helpers.arrayElement([
            'male',
            'female',
            'trans-male',
            'trans-female'
        ])
        },
        onlineStatus: faker.datatype.boolean(),
        height: faker.datatype.number({ min: 48, max: 95 }),
        description: '',
        postalCode: faker.address.zipCodeByState(usState),
        city: faker.address.city(),
        state: usState,
        maritalStatus: faker.helpers.arrayElement([
            'single',
            'married - interested in having an affair',
            'widowed',
            'divorced'
        ]),
        income: faker.datatype.number({ min: 37000, max: 296000 }),
        datingIntent: '',
        relationshipTypeSeeking: faker.helpers.arrayElement([
            'male',
            'female',
            'trans-male',
            'trans-female'
        ]),
        doesDateInteracially: faker.datatype.boolean(),
        interacialDatingPreferences: {
            races: doesDateInteracially ? datingPrefs : []
         },
        userMatches: {
            matches: []
        },
        blockedUsers: {
            users: []
        },
        favorites: {
            users: []
        },
        profileViews: {
            views: [
            ]
        },
        images: {
            imagePaths:[
                {
                    path: `${faker.datatype.number({ min: 2, max: 98 })}.jpg`,
                    date: new Date()
                }
           ]
        }
    })
}



export const userSearchResults  = {
    "users": [
        new User({
            "seekingGenders": {
                "genders": [
                    "trans-male"
                ]
            },
            "selectedMaritalStatuses": {
                "statuses": []
            },
            "geekInterests": {
                "interests": []
            },
            "interacialDatingPreferences": {
                "races": []
            },
            "raceDatingPreferences": {
                "races": []
            },
            "profileViews": {
                "views": []
            },
            "blockedUsers": {
                "users": []
            },
            "userMatches": {
                "matches": []
            },
            "images": {
                "imagePaths": [
                    {
                        "path": "12.jpg",
                        "date": "2023-03-15T01:42:59.088Z"
                    }
                ]
            },
            "_id": "641122a2079780fe4eab1b90",
            "random": "true",
            "username": "Johnathan.Rempel9",
            "age": 41,
            "email": "user@email.com",
            "gender": "female",
            "birthdate": "2023-03-15T01:42:59.087Z",
            "ethnicity": "White/Caucasian",
            "onlineStatus": true,
            "height": 66,
            "relationshipTypeSeeking": "male",
            "description": "",
            "postalCode": "46778",
            "city": "Donaldmouth",
            "state": "IN",
            "maritalStatus": "married - interested in having an affair",
            "datingIntent": "",
            "income": 208550,
            "doesDateInteracially": false,
        }),
         new User({
            "seekingGenders": {
                "genders": [
                    "trans-male"
                ]
            },
            "selectedMaritalStatuses": {
                "statuses": []
            },
            "geekInterests": {
                "interests": []
            },
            "interacialDatingPreferences": {
                "races": []
            },
            "raceDatingPreferences": {
                "races": []
            },
            "profileViews": {
                "views": []
            },
            "blockedUsers": {
                "users": []
            },
            "userMatches": {
                "matches": []
            },
            "images": {
                "imagePaths": [
                    {
                        "path": "44.jpg",
                        "date": "2023-03-15T01:43:11.604Z"
                    }
                ]
            },
            "_id": "641122af079780fe4eab1bde",
            "random": "true",
            "username": "Lolita42",
            "age": 21,
            "email": "user@email.com",
            "gender": "male",
            "birthdate": "2023-03-15T01:43:11.604Z",
            "ethnicity": "Indian",
            "onlineStatus": false,
            "height": 67,
            "relationshipTypeSeeking": "male",
            "description": "",
            "postalCode": "47359",
            "city": "East Janashire",
            "state": "IN",
            "maritalStatus": "single",
            "datingIntent": "",
            "income": 50898,
            "doesDateInteracially": false,
        }),
         new User({
            "seekingGenders": {
                "genders": [
                    "male"
                ]
            },
            "selectedMaritalStatuses": {
                "statuses": []
            },
            "geekInterests": {
                "interests": []
            },
            "interacialDatingPreferences": {
                "races": []
            },
            "raceDatingPreferences": {
                "races": []
            },
            "profileViews": {
                "views": []
            },
            "blockedUsers": {
                "users": []
            },
            "userMatches": {
                "matches": []
            },
            "images": {
                "imagePaths": [
                    {
                        "path": "12.jpg",
                        "date": "2023-03-15T01:43:17.277Z"
                    }
                ]
            },
            "_id": "641122b4079780fe4eab1c04",
            "random": "true",
            "username": "Cody.Vandervort",
            "age": 25,
            "email": "user@email.com",
            "gender": "trans-female",
            "birthdate": "2023-03-15T01:43:17.276Z",
            "ethnicity": "Mixed Race",
            "onlineStatus": false,
            "height": 51,
            "relationshipTypeSeeking": "trans-female",
            "description": "",
            "postalCode": "43520",
            "city": "East Loraineside",
            "state": "OH",
            "maritalStatus": "widowed",
            "datingIntent": "",
            "income": 172834,
            "doesDateInteracially": true,
        }),
         new User({
            "seekingGenders": {
                "genders": [
                    "trans-female"
                ]
            },
            "selectedMaritalStatuses": {
                "statuses": []
            },
            "geekInterests": {
                "interests": []
            },
            "interacialDatingPreferences": {
                "races": [
                    "White/Caucasian",
                    "Native American"
                ]
            },
            "raceDatingPreferences": {
                "races": []
            },
            "profileViews": {
                "views": []
            },
            "blockedUsers": {
                "users": []
            },
            "userMatches": {
                "matches": []
            },
            "images": {
                "imagePaths": [
                    {
                        "path": "43.jpg",
                        "date": "2023-03-15T01:43:47.101Z"
                    }
                ]
            },
            "_id": "641122d2079780fe4eab1cbc",
            "random": "true",
            "username": "Noemie.Krajcik64",
            "age": 33,
            "email": "user@email.com",
            "gender": "trans-female",
            "birthdate": "2023-03-15T01:43:47.101Z",
            "ethnicity": "White/Caucasian",
            "onlineStatus": true,
            "height": 64,
            "relationshipTypeSeeking": "female",
            "description": "",
            "postalCode": "43307",
            "city": "Ednatown",
            "state": "OH",
            "maritalStatus": "divorced",
            "datingIntent": "",
            "income": 67000,
            "doesDateInteracially": true,
        })
    ]
}