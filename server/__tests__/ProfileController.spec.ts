import { Types } from 'mongoose'
import supertest from 'supertest'
import jwtToken from 'jsonwebtoken'
import createServer from '../utils/server'
import UserService from '../services/UserService'
import ProfileService from '../services/ProfileService'
import { defaultConfig } from '../config/default.server'
import { messages } from './mocks/messages.mock.js'
import { zipcodes, zipcodeError } from './mocks/zipcodes.mock.js'
import {
    currentUser,
    targetUser,
    createUser,
    userSearchResults
} from './mocks/users.mock.js'
import {
    jest,
    describe,
    it,
    expect,
    afterEach,
    beforeEach
} from '@jest/globals'
import { UserType } from 'types/users'
const { app } = createServer()
const secret = defaultConfig.authentication.jwtSecret

// https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export

beforeEach(() => {})

afterEach(async () => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
})

function getJwt(userEmail: string, userID: string) {
    return jwtToken.sign(
        {
            email: userEmail,
            userId: userID
        },
        secret,
        { expiresIn: '1h' }
    )
}

describe('ProfileController', () => {
    describe('ProfileController - getInboxMessagesForUser', () => {
        it('should return a 401 given Authorization header is present', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const totalItemsMock = jest
                .spyOn(ProfileService, 'getTotalMessageCountForUser')
                .mockReturnValueOnce(null)
            const { body } = await supertest(app)
                .get('/inbox/messages')
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).not.toHaveBeenCalled()
            expect(totalItemsMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 401 given no userId supplied', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const totalItemsMock = jest
                .spyOn(ProfileService, 'getTotalMessageCountForUser')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/inbox/messages')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).toHaveBeenCalled()
            expect(totalItemsMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it("all mocks should've been called given service methods return expected values", async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const totalItemsMock = jest
                .spyOn(ProfileService, 'getTotalMessageCountForUser')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(1)
                    })
                )
            const authUsersMessagesMock = jest
                .spyOn(ProfileService, 'getMessagesForAuthenticatedUser')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(messages)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .get('/inbox/messages')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
            expect(authUserMock).toHaveBeenCalled()
            expect(totalItemsMock).toHaveBeenCalled()
            expect(authUsersMessagesMock).toHaveBeenCalled()
        })
        it('should match expected object given valid inputs', async () => {
            jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(currentUser)
                })
            )
            jest.spyOn(
                ProfileService,
                'getTotalMessageCountForUser'
            ).mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(1)
                })
            )
            jest.spyOn(
                ProfileService,
                'getMessagesForAuthenticatedUser'
            ).mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(messages)
                })
            )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/inbox/messages')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
            expect.objectContaining(messages as Record<string, any>)
            expect(body).toHaveProperty('totalItems', 1)
        })
    })
    describe('ProfileController - getMessagesFromSender', () => {
        it('should return a 401 given no Authorization header is present', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const { body } = await supertest(app)
                .get(`/sender/${null}/messages`)
                .expect(401)
            expect(authUserMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 401 given no userId supplied', async () => {
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(
                null
            )
            const { body } = await supertest(app)
                .get(`/sender/${null}/messages`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it("should return 200 and all mocks should've been called", async () => {
            const loggedInUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const targetUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(targetUser)
                    })
                )
            const messagesMock = jest
                .spyOn(ProfileService, 'getMessageThreadForUsers')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(messages)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .get(`/sender/${targetUser._id.toString()}/messages`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(loggedInUserMock).toHaveBeenCalled()
            expect(targetUserMock).toHaveBeenCalled()
            expect(messagesMock).toHaveBeenCalled()
        })
        it('should return 200 and return an array of messages', async () => {
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(currentUser)
                })
            )
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(targetUser)
                })
            )
            jest.spyOn(
                ProfileService,
                'getMessageThreadForUsers'
            ).mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(messages)
                })
            )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get(`/sender/${targetUser._id.toString()}/messages`)
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect.objectContaining(messages as Record<string, any>)
            expect(body).toHaveProperty('deletedAccount', false)
        })
    })
    describe('ProfileController - getSentMessagesForUser', () => {
        it('should return a 401 no Authorization header is present', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const sentMessagesMock = jest
                .spyOn(ProfileService, 'getSentMessagesForLoggedInUser')
                .mockReturnValueOnce(null)
            const { body } = await supertest(app)
                .get('/sent/messages')
                .expect(401)
            expect(authUserMock).not.toHaveBeenCalled()
            expect(sentMessagesMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 401 given user is not logged in and authUserMock should be called', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const sentMessagesMock = jest
                .spyOn(ProfileService, 'getSentMessagesForLoggedInUser')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/sent/messages')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).toHaveBeenCalled()
            expect(sentMessagesMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it("should return a 200 and all mock functions should've been called", async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const sentMessagesMock = jest
                .spyOn(ProfileService, 'getSentMessagesForLoggedInUser')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(messages)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .get('/sent/messages')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(sentMessagesMock).toHaveBeenCalled()
        })
        it("should return a 200 and a user's sent messages", async () => {
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(currentUser)
                })
            )
            jest.spyOn(
                ProfileService,
                'getSentMessagesForLoggedInUser'
            ).mockReturnValueOnce(
                new Promise((resolve, _) => {
                    return resolve(messages)
                })
            )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .get('/sent/messages')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect.objectContaining(messages as Record<string, any>)
        })
    })
    describe('ProfileController - getUserProfileViews', () => {
        it('should return a 401 given no Authorization header exists', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const provifileViewsMock = jest
                .spyOn(UserService, 'getProfileViews')
                .mockReturnValueOnce(null)
            await supertest(app).get('/profile/views').expect(401)
            expect(authUserMock).not.toHaveBeenCalled()
            expect(provifileViewsMock).not.toHaveBeenCalled()
        })
        it('should return a 401 given no userId supplied', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const provifileViewsMock = jest
                .spyOn(UserService, 'getProfileViews')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .get('/profile/views')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).toHaveBeenCalled()
            expect(provifileViewsMock).not.toHaveBeenCalled()
        })
        it("should return a 200 and all mock functions shoud've been called", async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const provifileViewsMock = jest
                .spyOn(UserService, 'getProfileViews')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser.profileViews.views)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .get('/profile/views')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(provifileViewsMock).toHaveBeenCalled()
        })
    })
    describe('ProfileController - getUsersInBlockList', () => {
        it('should return a 200 and all mock functions called', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const currentUserBlockedList = {
                blockedUsers: {
                    users: [{ userId: new Types.ObjectId().toString() }]
                }
            }
            const blockedUsersMock = jest
                .spyOn(UserService, 'getUsersBlockedList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )

            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            Object.assign(currentUser, currentUserBlockedList)
            const { body } = await supertest(app)
                .get('/user-list/blocked')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(blockedUsersMock).toHaveBeenCalled()
        })
        it('should return a 200 and a list of blocked users', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const currentUserBlockedList = {
                blockedUsers: {
                    users: [{ userId: new Types.ObjectId().toString() }]
                }
            }
            const blockedUsersMock = jest
                .spyOn(UserService, 'getUsersBlockedList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )

            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            Object.assign(currentUser, currentUserBlockedList)
            const { body } = await supertest(app)
                .get('/user-list/blocked')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(blockedUsersMock).toHaveBeenCalled()
            expect(body.blockList).toMatchObject(
                currentUserBlockedList.blockedUsers.users
            )
        })
    })
    describe('ProfileController - getUsersInFavoriteList', () => {
        it('should return a 401 Authorization header is present', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const userServicedMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const { body } = await supertest(app)
                .get('/user-list/favorites')
                .expect(401)
            expect(authUserMock).not.toHaveBeenCalled()
            expect(userServicedMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 401 unauthorized given no userId supplied', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const userServicedMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/user-list/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).toHaveBeenCalled()
            expect(userServicedMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 200 and a list of favorites given a user exists', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )

            const userServicedMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const currentUserFavorites = {
                favorites: {
                    users: [{ userId: new Types.ObjectId().toString() }]
                }
            }

            Object.assign(currentUser, currentUserFavorites)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body, status } = await supertest(app)
                .get('/user-list/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(userServicedMock).toHaveBeenCalled()
            expect(body.favoriteList).toMatchObject(
                currentUserFavorites.favorites.users
            )
        })
    })
    describe('ProfileController - getRandomUserForMatchMaker', () => {
        it('should return a 401 unauthroized given no userId supplied', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const randomeMatchMock = jest
                .spyOn(UserService, 'getRandomMatchByGender')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/user/matchmaker')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).toHaveBeenCalled()
            expect(randomeMatchMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })

      it('should return a 200 and a list of random matches for the user', async () => {
        const randomUser1 = createUser()
        const randomUser2 = createUser()
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const randomMatches = {
                userMatches: {
                    matches: [
                        {
                            userId: randomUser1._id.toString()
                        },
                        {
                            userId: randomUser2._id.toString()
                        }
                    ]
                }
            }
            const returnedMatches  = [{ ...randomUser1 },{ ...randomUser2 }]
            Object.assign(currentUser, randomMatches)

            const randomeMatchMock = jest
                .spyOn(UserService, 'getRandomMatchByGender')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                      return resolve(returnedMatches)
                    })
                )

            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/user/matchmaker')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(randomeMatchMock).toHaveBeenCalled()
        })
    })
    describe('ProfileController - getRandomTenRandomUsers', () => {
        it('should return a 401 given not Authorization header present', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )

            const randomUserServicedMock = jest
                .spyOn(UserService, 'getTenRandomUsers')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )

            const { body } = await supertest(app)
                .get('/view/random/users')
                .expect(401)
            expect(authUserMock).not.toHaveBeenCalled()
            expect(randomUserServicedMock).not.toHaveBeenCalled()
        })
        it('should return a 401 given userId supplied', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )

            const randomUserServicedMock = jest
                .spyOn(UserService, 'getTenRandomUsers')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/view/random/users')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authUserMock).toHaveBeenCalled()
            expect(randomUserServicedMock).not.toHaveBeenCalled()
        })
        it('should return a 200 and 10 random users', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            // create 10 random users
            const users: UserType[] = []
            for (let i = 1; i <= 10; i++) {
                const user = createUser()
                users.push(user)
            }
            const randomUserServicedMock = jest
                .spyOn(UserService, 'getTenRandomUsers')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(users)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .get('/view/random/users')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() })
                .expect(200)
            expect(authUserMock).toHaveBeenCalled()
            expect(randomUserServicedMock).toHaveBeenCalled()
            expect(body.users.length).toBe(10)
        })
    })
    describe('ProfileController - addUserToMatchList', () => {
        it('should retun a 401 unauthroized given no Authorization header present', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)

            const findUserToAddForMatchListMock = jest
                .spyOn(UserService, 'findTargetUserToAddForMatchList')
                .mockReturnValueOnce(null)
            const addUnMatchedToMatchListMock = jest
                .spyOn(UserService, 'addUnMatchedToMatchList')
                .mockReturnValueOnce(null)
            const checkIfMutualMatchMock = jest
                .spyOn(UserService, 'checkMutalMatch')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app).post('/add-user/matchlist').expect(401)

            expect(authUserMock).not.toHaveBeenCalled()
            expect(findUserToAddForMatchListMock).not.toHaveBeenCalled()
            expect(addUnMatchedToMatchListMock).not.toHaveBeenCalled()
            expect(checkIfMutualMatchMock).not.toHaveBeenCalled()
        })
        it('should retun a 401 unauthroized given no userId supplied', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)

            const findUserToAddForMatchListMock = jest
                .spyOn(UserService, 'findTargetUserToAddForMatchList')
                .mockReturnValueOnce(null)
            const addUnMatchedToMatchListMock = jest
                .spyOn(UserService, 'addUnMatchedToMatchList')
                .mockReturnValueOnce(null)
            const checkIfMutualMatchMock = jest
                .spyOn(UserService, 'checkMutalMatch')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            await supertest(app)
                .post('/add-user/matchlist')
                .set('Authorization', `Bearer ${jwt}`)
                .send({
                    userId: null,
                    userProfileId: targetUser._id.toString()
                })
                .expect(401)

            expect(authUserMock).toHaveBeenCalled()
            expect(findUserToAddForMatchListMock).not.toHaveBeenCalled()
            expect(addUnMatchedToMatchListMock).not.toHaveBeenCalled()
            expect(checkIfMutualMatchMock).not.toHaveBeenCalled()
        })

        it('should return a 400 given a target user no longer exists', async () => {
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const findUserToAddForMatchListMock = jest
                .spyOn(UserService, 'findTargetUserToAddForMatchList')
                .mockReturnValueOnce(null)

            const addUnMatchedToMatchListMock = jest
                .spyOn(UserService, 'addUnMatchedToMatchList')
                .mockReturnValueOnce(null)
            const checkIfMutualMatchMock = jest
                .spyOn(UserService, 'checkMutalMatch')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { status } = await supertest(app)
                .post('/add-user/matchlist')
                .send({ userProfileId: targetUser._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)
            expect(status).toBe(400)
            expect(authUserMock).toHaveBeenCalled()
            expect(findUserToAddForMatchListMock).toHaveBeenCalled()
            expect(addUnMatchedToMatchListMock).not.toHaveBeenCalled()
            expect(checkIfMutualMatchMock).not.toHaveBeenCalled()
        })

        it('should return 200 and mutual match if both users exist in each others match list', async () => {
            const user1 = createUser()
            const user2 = createUser()

            const currentUserMatchList = {
                userMatches: {
                    matches: [{ userId: user1._id.toString() }]
                }
            }

            const targetUserMatchList = {
                userMatches: {
                    matches: [{ userId: user2._id.toString() }]
                }
            }

            Object.assign(user1, currentUserMatchList)
            Object.assign(user2, targetUserMatchList)
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )

            const findUserToAddForMatchListMock = jest
                .spyOn(UserService, 'findTargetUserToAddForMatchList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )

            const addUnMatchedToMatchListMock = jest
                .spyOn(UserService, 'addUnMatchedToMatchList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(undefined)
                    })
                )

            const checkIfMutualMatchMock = jest
                .spyOn(UserService, 'checkMutalMatch')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )

            const jwt = getJwt(currentUser.email, currentUser._id.toString())

            const { body, status } = await supertest(app)
                .post('/add-user/matchlist')
                .send({ userProfileId: user1._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)

            expect(status).toBe(200)
            expect(body).toHaveProperty(
                'message',
                'User added to matches successfully! And is a Mutual Match'
            )
            expect(authUserMock).toHaveBeenCalled()
            expect(findUserToAddForMatchListMock).toHaveBeenCalled()
            expect(addUnMatchedToMatchListMock).toHaveBeenCalled()
            expect(checkIfMutualMatchMock).toHaveBeenCalled()
            expect(body).toHaveProperty('isMutualMatch', true)
        })
        it('should return 200 and User added to matches if there is not a mutual match', async () => {
            const user1 = createUser()
            const user2 = createUser()

            const currentUserMatchList: {
                userMatches: { matches: Array<{ userId: string }> | [] }
            } = {
                userMatches: {
                    matches: []
                }
            }

            const targetUserMatchList: {
                userMatches: { matches: Array<{ userId: string }> | [] }
            } = {
                userMatches: {
                    matches: []
                }
            }

            Object.assign(user1, currentUserMatchList)
            Object.assign(user2, targetUserMatchList)
            const authUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )

            const findUserToAddForMatchListMock = jest
                .spyOn(UserService, 'findTargetUserToAddForMatchList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )

            const addUnMatchedToMatchListMock = jest
                .spyOn(UserService, 'addUnMatchedToMatchList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )

            const checkIfMutualMatchMock = jest
                .spyOn(UserService, 'checkMutalMatch')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )

            const jwt = getJwt(currentUser.email, currentUser._id.toString())

            const { body, status } = await supertest(app)
                .post('/add-user/matchlist')
                .send({ userProfileId: user1._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)

            expect(status).toBe(200)
            expect(body).toHaveProperty(
                'message',
                'User added to matches successfully!'
            )
            expect(authUserMock).toHaveBeenCalled()
            expect(findUserToAddForMatchListMock).toHaveBeenCalled()
            expect(addUnMatchedToMatchListMock).toHaveBeenCalled()
            expect(checkIfMutualMatchMock).toHaveBeenCalled()
            expect(body).toHaveProperty('isMutualMatch', false)
        })
    })
    describe('ProfileController - addUserToFavorites', () => {
        it('should return 401 given Authorization header present', async () => {
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const userIsFavoritedMock = jest
                .spyOn(UserService, 'checkIfUserIsAlreadyInFavorites')
                .mockReturnValueOnce(null)
            const targetUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const addUserToFavoriteListMock = jest
                .spyOn(UserService, 'addUserToFavoriteList')
                .mockReturnValueOnce(null)
            await supertest(app).post('/add/favorites').expect(401)
            expect(authorizedUserMock).not.toHaveBeenCalled()
            expect(userIsFavoritedMock).not.toHaveBeenCalled()
            expect(targetUserMock).not.toHaveBeenCalled()
            expect(addUserToFavoriteListMock).not.toHaveBeenCalled()
        })
        it('should return 401 given no userId supplied', async () => {
            const user1 = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const userIsFavoritedMock = jest
                .spyOn(UserService, 'checkIfUserIsAlreadyInFavorites')
                .mockReturnValueOnce(null)
            const targetUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const addUserToFavoriteListMock = jest
                .spyOn(UserService, 'addUserToFavoriteList')
                .mockReturnValueOnce(null)
            const jwt = getJwt(user1.email, user1._id.toString())
            await supertest(app)
                .post('/add/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(userIsFavoritedMock).not.toHaveBeenCalled()
            expect(targetUserMock).not.toHaveBeenCalled()
            expect(addUserToFavoriteListMock).not.toHaveBeenCalled()
        })
         it('should return 422 given the target user no longer exists ', async () => {
            const user1 = createUser()
            const user2 = createUser()

            const authorizedUsersFavoriteList = {
                favorites: {
                    users: [
                        {
                            userId: user2._id.toString()
                        }
                    ]
                }
            }

            Object.assign(user1, authorizedUsersFavoriteList)

            const jwt = getJwt(user1.email, user1._id.toString())
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const userIsFavoritedMock = jest
                .spyOn(UserService, 'checkIfUserIsAlreadyInFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )
            const targetUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(undefined)
                    })
                )
            const addUserToFavoriteListMock = jest
                .spyOn(UserService, 'addUserToFavoriteList')
                .mockReturnValueOnce(null)
            const { body } = await supertest(app)
                .post('/add/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: user2._id.toString() })
                .expect(422)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(userIsFavoritedMock).not.toHaveBeenCalled()
            expect(targetUserMock).toHaveBeenCalled()
            expect(addUserToFavoriteListMock).not.toHaveBeenCalled()

            expect(body).toHaveProperty(
                'message',
                'Unable to locate this account'
            )
        })
        it('should return 400 given the target user is already in current users favorite list ', async () => {
            const user1 = createUser()
            const user2 = createUser()

            const authorizedUsersFavoriteList = {
                favorites: {
                    users: [
                        {
                            userId: user2._id.toString()
                        }
                    ]
                }
            }

            Object.assign(user1, authorizedUsersFavoriteList)

            const jwt = getJwt(user1.email, user1._id.toString())
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const userIsFavoritedMock = jest
                .spyOn(UserService, 'checkIfUserIsAlreadyInFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )
            const targetUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )
            const addUserToFavoriteListMock = jest
                .spyOn(UserService, 'addUserToFavoriteList')
                .mockReturnValueOnce(null)
            const { body } = await supertest(app)
                .post('/add/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: user2._id.toString() })
                .expect(400)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(userIsFavoritedMock).toHaveBeenCalled()
            expect(targetUserMock).toHaveBeenCalled()
            expect(addUserToFavoriteListMock).not.toHaveBeenCalled()

            expect(body).toHaveProperty(
                'message',
                'User is already in your list of favorites'
            )
        })
        it('should return 200 and user should be added to the current user favorite list', async () => {
            const user1 = createUser()
            const user2 = createUser()

            const authorizedUsersFavorites = {
                blockedUsers: {
                    users: [
                        {
                            userId: user2._id.toString()
                        }
                    ]
                }
            }

            Object.assign(currentUser, authorizedUsersFavorites)

            const jwt = getJwt(user1.email, user1._id.toString())
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const userIsFavoritedMock = jest
                .spyOn(UserService, 'checkIfUserIsAlreadyInFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )
            const targetUserMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )
            const addUserToFavoriteListMock = jest
                .spyOn(UserService, 'addUserToFavoriteList')
                .mockReturnValueOnce(undefined)
            const { body } = await supertest(app)
                .post('/add/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: targetUser._id.toString() })
                .expect(200)

            expect(authorizedUserMock).toHaveBeenCalled()
            expect(targetUserMock).toHaveBeenCalled()
            expect(userIsFavoritedMock).toHaveBeenCalled()
            expect(addUserToFavoriteListMock).toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'User added to favorites successfully!'
            )
        })
    })

    describe('ProfileController - removeUserFromFavorites', () => {
        it('should return 401 given no auth header present', async () => {
            const user1 = createUser()
            const user2 = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const personToRemoveMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const removeUserFromFavoriteListMock = jest
                .spyOn(UserService, 'removeUserFromFavoriteList')
                .mockReturnValueOnce(null)
            const getAuthUserFavoritesMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(null)
            const jwt = getJwt(user1.email, user1._id.toString())
            const { body } = await supertest(app)
                .post('/remove/favorites')
                .expect(401)
            expect(authorizedUserMock).not.toHaveBeenCalled()
            expect(personToRemoveMock).not.toHaveBeenCalled()
            expect(removeUserFromFavoriteListMock).not.toHaveBeenCalled()
            expect(getAuthUserFavoritesMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return 401 given so userId supplied', async () => {
            const user1 = createUser()
            const user2 = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(null)
            const personToRemoveMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const removeUserFromFavoriteListMock = jest
                .spyOn(UserService, 'removeUserFromFavoriteList')
                .mockReturnValueOnce(null)
            const getAuthUserFavoritesMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(null)
            const jwt = getJwt(user1.email, user1._id.toString())
            const { body } = await supertest(app)
                .post('/remove/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: user2._id.toString() })
                .expect(401)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(personToRemoveMock).not.toHaveBeenCalled()
            expect(removeUserFromFavoriteListMock).not.toHaveBeenCalled()
            expect(getAuthUserFavoritesMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return 422 given target user no longer exists', async () => {
            const user1 = createUser()
            const user2 = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const personToRemoveMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)
            const removeUserFromFavoriteListMock = jest
                .spyOn(UserService, 'removeUserFromFavoriteList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )
            const getAuthUserFavoritesMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const jwt = getJwt(user1.email, user1._id.toString())
            const { body } = await supertest(app)
                .post('/remove/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: user2._id.toString() })
                .expect(422)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(personToRemoveMock).toHaveBeenCalled()
            expect(removeUserFromFavoriteListMock).not.toHaveBeenCalled()
            expect(getAuthUserFavoritesMock).not.toHaveBeenCalled()
        })
        it('should return 400 given target user could not be removed', async () => {
            const user1 = createUser()
            const user2 = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const personToRemoveMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )
            const removeUserFromFavoriteListMock = jest
                .spyOn(UserService, 'removeUserFromFavoriteList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )
            const getAuthUserFavoritesMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(null)
            const jwt = getJwt(user1.email, user1._id.toString())
            const { body } = await supertest(app)
                .post('/remove/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: user2._id.toString() })
                .expect(400)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(personToRemoveMock).toHaveBeenCalled()
            expect(removeUserFromFavoriteListMock).toHaveBeenCalled()
            expect(getAuthUserFavoritesMock).not.toHaveBeenCalled()
        })
        it('should return 200 and a list of users favorites', async () => {
            // Current user
            const user1 = createUser()

            //Remoed User
            const user2 = createUser()
            // List of users
            const user3 = createUser()
            const user4 = createUser()
            const user5 = createUser()

            const authUsersFavorites = {
                favorites: {
                    users: [
                        { userId: user3._id.toString() },
                        { userId: user4._id.toString() },
                        { userId: user5._id.toString() }
                    ]
                }
            }

            Object.assign(user1, authUsersFavorites)

            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const personToRemoveMock = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user2)
                    })
                )
            const removeUserFromFavoriteListMock = jest
                .spyOn(UserService, 'removeUserFromFavoriteList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )
            const getAuthUserFavoritesMock = jest
                .spyOn(UserService, 'findUsersFavorites')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(user1)
                    })
                )
            const jwt = getJwt(user1.email, user1._id.toString())

            const { body } = await supertest(app)
                .post('/remove/favorites')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userProfileId: user2._id.toString() })
                .expect(200)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(personToRemoveMock).toHaveBeenCalled()
            expect(removeUserFromFavoriteListMock).toHaveBeenCalled()
            expect(getAuthUserFavoritesMock).toHaveBeenCalled()
            expect(body.favorites).toMatchObject(
                authUsersFavorites.favorites.users
            )
            expect(body).toHaveProperty(
                'message',
                'User successfully removed from favorites'
            )
        })
    })
    describe('ProfileController - addUserToBlockList', () => {
        it('should return a 401 given no Authorization header present', async () => {
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
            )
            const checkIfUserIdExistsMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce( new Promise((resolve, _) => {
                        return resolve(undefined)
            }))
            const checkIfUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(null)

            const addUserToBlockListMock = jest
                .spyOn(UserService, 'addUserToBlockList')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/add')
                .expect(401)
            expect(authorizedUserMock).not.toHaveBeenCalled()
            expect(checkIfUserIsBlockedMock).not.toHaveBeenCalled()
            expect(checkIfUserIdExistsMock).not.toHaveBeenCalled()
            expect(addUserToBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 401 given user is not Authenticated', async () => {
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
            )
            
            const checkIfUserIdExistsMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce( new Promise((resolve, _) => {
                        return resolve(undefined)
            }))
            const checkIfUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(null)

            const addUserToBlockListMock = jest
                .spyOn(UserService, 'addUserToBlockList')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/add')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserIsBlockedMock).not.toHaveBeenCalled()
            expect(checkIfUserIdExistsMock).not.toHaveBeenCalled()
            expect(addUserToBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
          it('should return a 422 given targetUser no longer exists', async () => {
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
            )
            
            const checkIfUserIdExistsMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce( new Promise((resolve, _) => {
                        return resolve(undefined)
            }))
            const checkIfUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(null)

            const addUserToBlockListMock = jest
                .spyOn(UserService, 'addUserToBlockList')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/add')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString(), userToBlockId: targetUser._id.toString() })
                .expect(422)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserIdExistsMock).toHaveBeenCalled()
            expect(checkIfUserIsBlockedMock).not.toHaveBeenCalled()
            expect(addUserToBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'This user was not found'
            )
        })
        it('should return a 400 given user is already in the blockedList', async () => {
            const currentUser = createUser()
            const targetUser = createUser()

            const currentUsersBlockList = {
                blockUsers: {
                    users: [{ userId: targetUser._id.toString() }]
                }
            }

            Object.assign(currentUser, currentUsersBlockList)
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
            )
            const checkIfUserIdExistsMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce( new Promise((resolve, _) => {
                        return resolve(targetUser)
            }))
            const checkIfUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )

            const addUserToBlockListMock = jest
                .spyOn(UserService, 'addUserToBlockList')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/add')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString(), userToBlockId: targetUser._id.toString() })
                .expect(400)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserIdExistsMock).toHaveBeenCalled()
            expect(checkIfUserIsBlockedMock).toHaveBeenCalled()
            expect(addUserToBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'User is already in the list'
            )
        })
        it('should return a 200 and target user should be added to users blockedList', async () => {
            const currentUser = createUser()
            const targetUser = createUser()

            const currentUsersBlockList = {
                blockUsers: {
                    users: [{ userId: targetUser._id.toString() }]
                }
            }

            Object.assign(currentUser, currentUsersBlockList)
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
            )
            const checkIfUserIdExistsMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce( new Promise((resolve, _) => {
                        return resolve(targetUser)
            }))
            const checkIfUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )

            const addUserToBlockListMock = jest
                .spyOn(UserService, 'addUserToBlockList')
                .mockReturnValueOnce(undefined)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/add')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString(), userToBlockId: targetUser._id.toString() })
                .expect(200)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserIdExistsMock).toHaveBeenCalled()
            expect(checkIfUserIsBlockedMock).toHaveBeenCalled()
            expect(addUserToBlockListMock).toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'User added to your block list'
            )
        })
    })
    describe('ProfileController - removeUserFromBlockList', () => {
        it('should return a 401 given user is not authenticated', async () => {
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(null)

            const removeUserToBlockListMock = jest
                .spyOn(UserService, 'removeUserFromBlockList')
                .mockReturnValueOnce(null)

            const retrieveUsersBlockListMock = jest
                .spyOn(UserService, 'getUsersBlockedList')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/remove')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ userId: null })
                .expect(401)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).not.toHaveBeenCalled()
            expect(removeUserToBlockListMock).not.toHaveBeenCalled()
            expect(retrieveUsersBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Unauthorized you are not logged in!'
            )
        })
        it('should return a 422 given there was problem retrieving target user account', async () => {
            const currentUser = createUser()

            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )

            const removeUserToBlockListMock = jest
                .spyOn(UserService, 'removeUserFromBlockList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )

            const retrieveUsersBlockListMock = jest
                .spyOn(UserService, 'getUsersBlockedList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/remove')
                .send({ userProfileId: targetUser._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(422)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).toHaveBeenCalled()
            expect(removeUserToBlockListMock).not.toHaveBeenCalled()
            expect(retrieveUsersBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Error retrieving users account'
            )
        })
        it('should return a 422 given there was problem removing target user from current users blockList', async () => {
            const currentUser = createUser()
            const targetUser = createUser()
            const user3 = createUser()
            const user4 = createUser()

            const currentUserBlockList = {
                blockedUsers: {
                    users: [
                        { userId: targetUser._id.toString() },
                        { userId: user3._id.toString() },
                        { userId: user4._id.toString() }
                    ]
                }
            }

            Object.assign(currentUser, currentUserBlockList)

            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(targetUser)
                    })
                )

            const removeUserToBlockListMock = jest
                .spyOn(UserService, 'removeUserFromBlockList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )

            const retrieveUsersBlockListMock = jest
                .spyOn(UserService, 'getUsersBlockedList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/remove')
                .send({ userProfileId: targetUser._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(422)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).toHaveBeenCalled()
            expect(removeUserToBlockListMock).toHaveBeenCalled()
            expect(retrieveUsersBlockListMock).not.toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'Error removing user from blockList'
            )
        })
        it('should return a 200 given and the current users blockList', async () => {
            const currentUser = createUser()
            const targetUser = createUser()
            const user3 = createUser()
            const user4 = createUser()

            const currentUserBlockList = {
                blockedUsers: {
                    users: [
                        { userId: user3._id.toString() },
                        { userId: user4._id.toString() }
                    ]
                }
            }

            Object.assign(currentUser, currentUserBlockList)

            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(targetUser)
                    })
                )

            const removeUserToBlockListMock = jest
                .spyOn(UserService, 'removeUserFromBlockList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )

            const retrieveUsersBlockListMock = jest
                .spyOn(UserService, 'getUsersBlockedList')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
                )
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/user/block/remove')
                .send({ userProfileId: targetUser._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).toHaveBeenCalled()
            expect(removeUserToBlockListMock).toHaveBeenCalled()
            expect(retrieveUsersBlockListMock).toHaveBeenCalled()
            expect(body).toHaveProperty(
                'message',
                'User removed from your block list'
            )
        })
    })
  

    describe('ProfileController - retrieveProfile', () => {
        it('should return a 401 given no authorization Header present', async () => {
            const currentUser = createUser()
            const targetUser = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
            )
            const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfCurrentUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfTargetUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )

            const addProfileViewer = jest
                .spyOn(UserService, 'addProfileViewer')
                .mockReturnValueOnce(null)

            const { body } = await supertest(app).post('/view/user').expect(401)
            expect(authorizedUserMock).not.toHaveBeenCalled()
            expect(updateUserAgeMock).not.toHaveBeenCalled()
            expect(checkIfUserExists).not.toHaveBeenCalled()
            expect(checkIfCurrentUserIsBlockedMock).not.toHaveBeenCalled()
            expect(checkIfTargetUserIsBlockedMock).not.toHaveBeenCalled()
            expect(addProfileViewer).not.toHaveBeenCalled()
        })
        it('should return a 401 given no userId supplied', async () => {
            const currentUser = createUser()
            const targetUser = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
            )
             const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfCurrentUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfTargetUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const addProfileViewer = jest
                .spyOn(UserService, 'addProfileViewer')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/view/user')
                .send({ userId: null })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(401)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(updateUserAgeMock).not.toHaveBeenCalled()
            expect(checkIfUserExists).not.toHaveBeenCalled()
            expect(checkIfCurrentUserIsBlockedMock).not.toHaveBeenCalled()
            expect(checkIfTargetUserIsBlockedMock).not.toHaveBeenCalled()
            expect(addProfileViewer).not.toHaveBeenCalled()
        })
        it('should return a 422 given targetUser no longer exists', async () => {
            const currentUser = createUser()
            const targetUser = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
            )
            const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfCurrentUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const checkIfTargetUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(null)
                    })
                )
            const addProfileViewer = jest
                .spyOn(UserService, 'addProfileViewer')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/view/user')
                .send({ userId: null })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(422)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).toHaveBeenCalled()
             expect(updateUserAgeMock).not.toHaveBeenCalled()
            expect(checkIfCurrentUserIsBlockedMock).not.toHaveBeenCalled()
            expect(checkIfTargetUserIsBlockedMock).not.toHaveBeenCalled()
            expect(addProfileViewer).not.toHaveBeenCalled()
        })
        it('should return a 403 given current user or targetUser exists in eithers blockList', async () => {
            const currentUser = createUser()
            const targetUser = createUser()
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
            )
            const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(targetUser)
                    })
                )
            const checkIfCurrentUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )
            const checkIfTargetUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(true)
                    })
                )
            const addProfileViewer = jest
                .spyOn(UserService, 'addProfileViewer')
                .mockReturnValueOnce(null)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/view/user')
                .send({ userId: targetUser._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(403)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).toHaveBeenCalled()
            expect(updateUserAgeMock).toHaveBeenCalled()
            expect(checkIfCurrentUserIsBlockedMock).toHaveBeenCalled()
            expect(checkIfTargetUserIsBlockedMock).toHaveBeenCalled()
            expect(addProfileViewer).not.toHaveBeenCalled()
        })
        it('should return a 200 and user profile', async () => {
            const currentUser = createUser()
            const targetUser = createUser()

            const targetUserProfileViews = {
                profileViews: {
                    views: [
                        {
                            userId: currentUser._id.toString(),
                            date: new Date().toString()
                        }
                    ]
                }
            }
            const authorizedUserMock = jest
                .spyOn(UserService, 'checkIfUserLoggedIn')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(currentUser)
                    })
            )
             const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
            const checkIfUserExists = jest
                .spyOn(UserService, 'checkIfUserIdExists')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(targetUser)
                    })
                )
            const checkIfCurrentUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )
            const checkIfTargetUserIsBlockedMock = jest
                .spyOn(UserService, 'checkIfUserIsBlocked')
                .mockReturnValueOnce(
                    new Promise((resolve, _) => {
                        return resolve(false)
                    })
                )

            const addProfileViewer = jest
                .spyOn(UserService, 'addProfileViewer')
                .mockReturnValueOnce(undefined)
            Object.assign(targetUser, targetUserProfileViews)
            const jwt = getJwt(currentUser.email, currentUser._id.toString())
            const { body } = await supertest(app)
                .post('/view/user')
                .send({ userId: targetUser._id.toString() })
                .set('Authorization', `Bearer ${jwt}`)
                .expect(200)
            expect(authorizedUserMock).toHaveBeenCalled()
            expect(checkIfUserExists).toHaveBeenCalled()
            expect(updateUserAgeMock).toHaveBeenCalled()
            expect(checkIfCurrentUserIsBlockedMock).toHaveBeenCalled()
            expect(checkIfTargetUserIsBlockedMock).toHaveBeenCalled()
            expect(addProfileViewer).toHaveBeenCalled()
            expect(body).toHaveProperty('message', 'User found')
            expect(body).toHaveProperty('blocked', false)
            expect(body.user.profileViews.views[0].userId).toEqual(
                currentUser._id.toString()
            )
        })
    })
    describe('ProfileController - basicProfileSearch', ()=>{
      it('should return a 401 given no auth header present', async () => {
        const authorizedUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(null)
        const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
        const fetchZipCodeMock = jest.spyOn(ProfileService, 'fetchZipCodeData').mockReturnValueOnce(null)
        const basicUserSearchQueryMock = jest.spyOn(ProfileService, 'basicUserSearchQuery').mockReturnValueOnce(null)
       
        const { body } = await supertest(app).post('/basic/search').expect(401)
        expect(authorizedUserMock).not.toHaveBeenCalled()
        expect(updateUserAgeMock).not.toHaveBeenCalled()
        expect(fetchZipCodeMock).not.toHaveBeenCalled()
        expect(basicUserSearchQueryMock).not.toHaveBeenCalled()
        })
       it('should return a 401 given no userId supplied', async () => {
         const authorizedUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(null)
         const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)
         const fetchZipCodeMock = jest.spyOn(ProfileService, 'fetchZipCodeData').mockReturnValueOnce(null)
         const basicUserSearchQueryMock = jest.spyOn(ProfileService, 'basicUserSearchQuery').mockReturnValueOnce(null)
         const jwt = getJwt(currentUser.email, currentUser._id.toString())
         const { body } = await supertest(app).post('/basic/search')
        .send({ usereId: null })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(401)
        expect(authorizedUserMock).toHaveBeenCalled()
        expect(updateUserAgeMock).not.toHaveBeenCalled()
        expect(fetchZipCodeMock).not.toHaveBeenCalled()
        expect(basicUserSearchQueryMock).not.toHaveBeenCalled()
       })
      it('should return a 404 given no zipcodes returned', async () => {
        const currentUser = createUser()
        const authorizedUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => { 
          return resolve(currentUser)
        }))
         const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)  
        const fetchZipCodeMock = jest.spyOn(ProfileService, 'fetchZipCodeData').mockReturnValueOnce(new Promise((resolve, _) => { 
          return resolve(zipcodeError)
        }))
        const searchParams = {
            "postalCode":"1111",
            "miles":"150"
        }
         const basicUserSearchQueryMock = jest.spyOn(ProfileService, 'basicUserSearchQuery').mockReturnValueOnce(null)
         const jwt = getJwt(currentUser.email, currentUser._id.toString())
         const { body } = await supertest(app).post('/basic/search')
        .send({ userId: currentUser._id.toString(), miles: searchParams.miles, postalCode: searchParams.postalCode })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        expect(authorizedUserMock).toHaveBeenCalled()
        expect(updateUserAgeMock).not.toHaveBeenCalled()
        expect(fetchZipCodeMock).toHaveBeenCalled()
        expect(body).toHaveProperty(
                'message',
                'You entered an invalid zipcode'
            )
        expect(basicUserSearchQueryMock).not.toHaveBeenCalled()
      })
      it('should return a 200 and an array of users', async () => {
        const currentUser = createUser()
        const authorizedUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => { 
          return resolve(currentUser)
        }))
         const updateUserAgeMock = jest.spyOn(UserService, 'updateUsersAge').mockReturnValueOnce(undefined)  
        const fetchZipCodeMock = jest.spyOn(ProfileService, 'fetchZipCodeData').mockReturnValueOnce(new Promise((resolve, _) => { 
          return resolve(zipcodes)
        }))
          const basicUserSearchQueryMock = jest.spyOn(ProfileService, 'basicUserSearchQuery').mockReturnValueOnce(new Promise((resolve, _) => { 
              return resolve(userSearchResults.users)
          }))

         const searchParams = {
            "postalCode":"46778",
            "miles":"150"
        }
         const jwt = getJwt(currentUser.email, currentUser._id.toString())
         const { body } = await supertest(app).post('/basic/search')
        .send({ userId: currentUser._id.toString(), miles: searchParams.miles, postalCode: searchParams.postalCode })
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        expect(authorizedUserMock).toHaveBeenCalled()
        expect(updateUserAgeMock).not.toHaveBeenCalled()
        expect(fetchZipCodeMock).toHaveBeenCalled()
        expect(body).not.toHaveProperty(
                'message',
                'You entered an invalid zipcode'
            )
          expect(basicUserSearchQueryMock).toHaveBeenCalled()
          expect(body.users.length).toEqual(userSearchResults.users.length)
      })
    })

    // describe('ProfileController - updateExtendedUserProfile', ()=>{
    //     it('should return a 200', async () => {
    //         const { body } = await supertest(app).post('/user/update/userprofile').expect(200)
    //         expect(body).toHaveProperty('message', 'This is this ProfileTest Route!!!!!')
    //     })
    // })
})
