
import { faker } from '@faker-js/faker'
import { Types } from 'mongoose'
import { UserType } from '../../types/users'
import User from '../../models/user.model.js'
 
export const userOneId = new Types.ObjectId()
export const userTwoId = new Types.ObjectId()

export  const residentialState = faker.address.stateAbbr()

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
      genders: [
        'female'
      ],
    },
    onlineStatus: faker.datatype.boolean(),
    height: faker.datatype.number({min: 48, max: 95}),
    description: '',
    postalCode: faker.address.zipCodeByState(residentialState),
    city:  faker.address.city(),
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
    height: faker.datatype.number({min: 48, max: 95}),
    description: '',
    postalCode: faker.address.zipCodeByState(residentialState),
    city:  faker.address.city(),
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


export const createUser = () => {
  return new User({
    _id: new Types.ObjectId(),
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
      genders: [
        'female'
      ],
    },
    onlineStatus: faker.datatype.boolean(),
    height: faker.datatype.number({min: 48, max: 95}),
    description: '',
    postalCode: faker.address.zipCodeByState(residentialState),
    city:  faker.address.city(),
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
    doesDateInteracially: faker.datatype.boolean(),
    userMatches: {
      matches: [
        { userId: { type: new Types.ObjectId(), ref: 'User' } }
      ]
    },
    blockedUsers: {
      users: [
        { userId: { type: new Types.ObjectId(), ref: 'User' } }
      ],
    },
    favorites: {
      users: [
        { userId: { type: new Types.ObjectId(), ref: 'User' } }
      ]
    },
    profileViews:{
      views: [
        { userId: { type: new Types.ObjectId(), date: new Date() } }
      ],
      
    },
    images: {},
  })
}