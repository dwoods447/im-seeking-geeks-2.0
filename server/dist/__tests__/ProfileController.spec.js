import { Types } from 'mongoose';
import supertest from 'supertest';
import jwtToken from 'jsonwebtoken';
import createServer from '../utils/server';
import UserService from '../services/UserService';
import ProfileService from '../services/ProfileService';
import { defaultConfig } from '../config/default.server';
import { messages } from './mocks/messages.mock.js';
import { currentUser, targetUser, userTwoId, createUser } from './mocks/users.mock.js';
import { jest, describe, it, expect, afterEach, beforeEach } from '@jest/globals';
const { app } = createServer();
const secret = defaultConfig.authentication.jwtSecret;
// https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export
beforeEach(() => {
});
afterEach(async () => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
});
function getJwt(userEmail, userID) {
    return jwtToken.sign({
        email: userEmail,
        userId: userID
    }, secret, { expiresIn: '1h' });
}
describe('ProfileController', () => {
    describe('ProfileController - getInboxMessagesForUser', () => {
        it('should return a 401 given no userId supplied', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(null);
            const totalItemsMock = jest.spyOn(ProfileService, 'getTotalMessageCountForUser').mockReturnValueOnce(null);
            const { body } = await supertest(app).get('/inbox/messages').expect(401);
            expect(authUserMock).toHaveBeenCalled();
            expect(totalItemsMock).not.toHaveBeenCalled();
            expect(body).toHaveProperty('message', 'Unauthorized you are not logged in!');
        });
        it('all mocks should\'ve been called given service methods return expected values', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const totalItemsMock = jest.spyOn(ProfileService, 'getTotalMessageCountForUser').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(1);
            }));
            const authUsersMessagesMock = jest.spyOn(ProfileService, 'getMessagesForAuthenticatedUser').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(messages);
            }));
            await supertest(app).get('/inbox/messages').send({ userId: currentUser._id.toString() });
            expect(authUserMock).toHaveBeenCalled();
            expect(totalItemsMock).toHaveBeenCalled();
            expect(authUsersMessagesMock).toHaveBeenCalled();
        });
        it('should match expected object given valid inputs', async () => {
            jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            jest.spyOn(ProfileService, 'getTotalMessageCountForUser').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(1);
            }));
            jest.spyOn(ProfileService, 'getMessagesForAuthenticatedUser').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(messages);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            const { body } = await supertest(app).get('/inbox/messages').set("Authorization", `Bearer ${jwt}`).send({ userId: currentUser._id.toString() });
            expect.objectContaining(messages);
            expect(body).toHaveProperty('totalItems', 1);
        });
    });
    describe('ProfileController - getMessagesFromSender', () => {
        it('should return a 401 given no userId supplied', async () => {
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(null);
            const { body } = await supertest(app).get(`/sender/${null}/messages`).expect(401);
            expect(body).toHaveProperty('message', 'Unauthorized you are not logged in!');
        });
        it('should return 200 and all mocks should\'ve been called', async () => {
            const loggedInUserMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const targetUserMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(targetUser);
            }));
            const messagesMock = jest.spyOn(ProfileService, 'getMessageThreadForUsers').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(messages);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            await supertest(app).get(`/sender/${userTwoId._id.toString()}/messages`).set("Authorization", `Bearer ${jwt}`).send({ userId: currentUser._id.toString() }).expect(200);
            expect(loggedInUserMock).toHaveBeenCalled();
            expect(targetUserMock).toHaveBeenCalled();
            expect(messagesMock).toHaveBeenCalled();
        });
        it('should return 200 and return an array of messages', async () => {
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(targetUser);
            }));
            jest.spyOn(ProfileService, 'getMessageThreadForUsers').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(messages);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            const { body } = await supertest(app).get(`/sender/${userTwoId._id.toString()}/messages`).set("Authorization", `Bearer ${jwt}`).send({ userId: currentUser._id.toString() }).expect(200);
            expect.objectContaining(messages);
            expect(body).toHaveProperty('deletedAccount', false);
        });
    });
    describe('ProfileController - getSentMessagesForUser', () => {
        it('should return a 401 given user is not logged in and authUserMock should be called', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(null);
            const sentMessagesMock = jest.spyOn(ProfileService, 'getSentMessagesForLoggedInUser').mockReturnValueOnce(null);
            const { body } = await supertest(app).get('/sent/messages').expect(401);
            expect(authUserMock).toHaveBeenCalled();
            expect(sentMessagesMock).not.toHaveBeenCalled();
            expect(body).toHaveProperty('message', 'Unauthorized you are not logged in!');
        });
        it('should return a 200 and all mock functions should\'ve been called', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const sentMessagesMock = jest.spyOn(ProfileService, 'getSentMessagesForLoggedInUser').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(messages);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            await supertest(app).get('/sent/messages').set("Authorization", `Bearer ${jwt}`).expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(sentMessagesMock).toHaveBeenCalled();
        });
        it('should return a 200 and a user\'s sent messages', async () => {
            jest.spyOn(UserService, 'checkIfUserIdExists').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            jest.spyOn(ProfileService, 'getSentMessagesForLoggedInUser').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(messages);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            await supertest(app).get('/sent/messages').set("Authorization", `Bearer ${jwt}`).expect(200);
            expect.objectContaining(messages);
        });
    });
    describe('ProfileController - getUserProfileViews', () => {
        it('should return a 401 given no userId supplied', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(null);
            const provifileViewsMock = jest.spyOn(UserService, 'getProfileViews').mockReturnValueOnce(null);
            await supertest(app).get('/profile/views').expect(401);
            expect(authUserMock).toHaveBeenCalled();
            expect(provifileViewsMock).not.toHaveBeenCalled();
        });
        it('should return a 200 and all mock functions shoud\'ve been called', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const provifileViewsMock = jest.spyOn(UserService, 'getProfileViews').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve([{
                        userId: {
                            type: new Types.ObjectId(), ref: 'User',
                        },
                        date: {
                            type: new Date()
                        }
                    }]);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            await supertest(app).get('/profile/views').set("Authorization", `Bearer ${jwt}`).expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(provifileViewsMock).toHaveBeenCalled();
        });
    });
    describe('ProfileController - getUsersInBlockList', () => {
        it('should return a 200 and all mock functions called', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const currentUserBlockedList = {
                blockedUsers: {
                    users: [
                        { userId: new Types.ObjectId().toString() }
                    ]
                }
            };
            const blockedUsersMock = jest.spyOn(UserService, 'findUsersInBlockedList').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            Object.assign(currentUser, currentUserBlockedList);
            const { body } = await supertest(app)
                .get('/user-list/blocked')
                .set("Authorization", `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() }).expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(blockedUsersMock).toHaveBeenCalled();
        });
        it('should return a 200 and a list of blocked users', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const currentUserBlockedList = {
                blockedUsers: {
                    users: [
                        { userId: new Types.ObjectId().toString() }
                    ]
                }
            };
            const blockedUsersMock = jest.spyOn(UserService, 'findUsersInBlockedList').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            Object.assign(currentUser, currentUserBlockedList);
            const { body } = await supertest(app)
                .get('/user-list/blocked')
                .set("Authorization", `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() }).expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(blockedUsersMock).toHaveBeenCalled();
            expect(body.blockList).toMatchObject(currentUserBlockedList.blockedUsers.users);
        });
    });
    describe('ProfileController - getUsersInFavoriteList', () => {
        it('should return a 401 unauthroized given no userId supplied', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(null);
            }));
            const userServicedMock = jest.spyOn(UserService, 'findUsersFavorites').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(null);
            }));
            const { body } = await supertest(app).get('/user-list/favorites').expect(401);
            expect(authUserMock).toHaveBeenCalled();
            expect(userServicedMock).not.toHaveBeenCalled();
            expect(body).toHaveProperty('message', 'Unauthorized you are not logged in!');
        });
        it('should return a 200 and a list of favorites given a user exists', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const userServicedMock = jest.spyOn(UserService, 'findUsersFavorites').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const currentUserFavorites = {
                favorites: {
                    users: [
                        { userId: new Types.ObjectId().toString() }
                    ]
                }
            };
            Object.assign(currentUser, currentUserFavorites);
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            const { body, status } = await supertest(app)
                .get('/user-list/favorites')
                .set("Authorization", `Bearer ${jwt}`)
                .send({ userId: currentUser._id.toString() }).expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(userServicedMock).toHaveBeenCalled();
            expect(body.favoriteList).toMatchObject(currentUserFavorites.favorites.users);
        });
    });
    describe('ProfileController - getRandomUserForMatchMaker', () => {
        it('should return a 401 unauthroized given no userId supplied', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(null);
            }));
            const randomeMatchMock = jest.spyOn(UserService, 'getRandomMatchByGender').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(null);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            const { body } = await supertest(app).get('/user/matchmaker').set("Authorization", `Bearer ${jwt}`).send({ userId: null }).expect(401);
            expect(authUserMock).toHaveBeenCalled();
            expect(randomeMatchMock).not.toHaveBeenCalled();
            expect(body).toHaveProperty('message', 'Unauthorized you are not logged in!');
        });
        it('should return a 200 and a list of random matches for the user', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            const randomMatches = {
                userMatches: {
                    matches: [
                        {
                            userId: new Types.ObjectId().toString()
                        }
                    ]
                },
            };
            Object.assign(currentUser, randomMatches);
            const randomeMatchMock = jest.spyOn(UserService, 'getRandomMatchByGender').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser.userMatches.matches);
            }));
            const jwt = getJwt(currentUser.email, currentUser._id.toString());
            const { body } = await supertest(app).get('/user/matchmaker').set("Authorization", `Bearer ${jwt}`).send({ userId: currentUser._id.toString() }).expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(randomeMatchMock).toHaveBeenCalled();
            expect(body.users).toMatchObject(currentUser.userMatches.matches);
        });
    });
    describe('ProfileController - getRandomTenRandomUsers', () => {
        it('should return a 401 given userId supplied', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(null);
            }));
            const randomUserServicedMock = jest.spyOn(UserService, 'getTenRandomUsers').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(null);
            }));
            const { body } = await supertest(app).get('/view/random/users').expect(401);
            expect(authUserMock).toHaveBeenCalled();
            expect(randomUserServicedMock).not.toHaveBeenCalled();
        });
        it('should return a 200 and 10 random users', async () => {
            const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(currentUser);
            }));
            // create 10 random users
            const users = [];
            for (let i = 1; i <= 10; i++) {
                const user = createUser();
                users.push(user);
            }
            const randomUserServicedMock = jest.spyOn(UserService, 'getTenRandomUsers').mockReturnValueOnce(new Promise((resolve, _) => {
                return resolve(users);
            }));
            const { body } = await supertest(app).get('/view/random/users').expect(200);
            expect(authUserMock).toHaveBeenCalled();
            expect(randomUserServicedMock).toHaveBeenCalled();
            expect(body.users.length).toBe(10);
        });
    });
    describe('ProfileController - addUserToMatchList', () => {
        describe('adding user as a match', () => {
            it('should retun a 401 unauthroized given no userId supplied', async () => {
                const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(null);
                const findUserToAddForMatchListMock = jest.spyOn(UserService, 'findTargetUserToAddForMatchList').mockReturnValueOnce(null);
                const addUnMatchedToMatchListMock = jest.spyOn(UserService, 'addUnMatchedToMatchList').mockReturnValueOnce(null);
                const checkIfMutualMatchMock = jest.spyOn(UserService, 'checkMutalMatch').mockReturnValueOnce(null);
                await supertest(app).post('/add-user/matchlist').send({ userProfileId: targetUser._id.toString() }).expect(401);
                expect(authUserMock).toHaveBeenCalled();
                expect(findUserToAddForMatchListMock).not.toHaveBeenCalled();
                expect(addUnMatchedToMatchListMock).not.toHaveBeenCalled();
                expect(checkIfMutualMatchMock).not.toHaveBeenCalled();
            });
            it('should return a 400 given a target user no longer exists', async () => {
                const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(currentUser);
                }));
                const findUserToAddForMatchListMock = jest.spyOn(UserService, 'findTargetUserToAddForMatchList').mockReturnValueOnce(null);
                const addUnMatchedToMatchListMock = jest.spyOn(UserService, 'addUnMatchedToMatchList').mockReturnValueOnce(null);
                const checkIfMutualMatchMock = jest.spyOn(UserService, 'checkMutalMatch').mockReturnValueOnce(null);
                const jwt = getJwt(currentUser.email, currentUser._id.toString());
                const { status } = await supertest(app)
                    .post('/add-user/matchlist')
                    .send({ userProfileId: targetUser._id.toString() })
                    .set("Authorization", `Bearer ${jwt}`);
                expect(status).toBe(400);
                expect(authUserMock).toHaveBeenCalled();
                expect(findUserToAddForMatchListMock).toHaveBeenCalled();
                expect(addUnMatchedToMatchListMock).not.toHaveBeenCalled();
                expect(checkIfMutualMatchMock).not.toHaveBeenCalled();
            });
            it('should return 200 and mutual match if both users exist in each others match list', async () => {
                const user1 = createUser();
                const user2 = createUser();
                const currentUserMatchList = {
                    userMatches: {
                        matches: [
                            { userId: user1._id.toString() }
                        ]
                    }
                };
                const targetUserMatchList = {
                    userMatches: {
                        matches: [
                            { userId: user2._id.toString() }
                        ]
                    }
                };
                Object.assign(user1, currentUserMatchList);
                Object.assign(user2, targetUserMatchList);
                const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(user1);
                }));
                const findUserToAddForMatchListMock = jest.spyOn(UserService, 'findTargetUserToAddForMatchList').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(user2);
                }));
                const addUnMatchedToMatchListMock = jest.spyOn(UserService, 'addUnMatchedToMatchList').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(undefined);
                }));
                const checkIfMutualMatchMock = jest.spyOn(UserService, 'checkMutalMatch').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(true);
                }));
                const jwt = getJwt(currentUser.email, currentUser._id.toString());
                const { body, status } = await supertest(app)
                    .post('/add-user/matchlist')
                    .send({ userProfileId: user1._id.toString() })
                    .set("Authorization", `Bearer ${jwt}`);
                expect(status).toBe(200);
                expect(body).toHaveProperty('message', 'User added to matches successfully! And is a Mutual Match');
                expect(authUserMock).toHaveBeenCalled();
                expect(findUserToAddForMatchListMock).toHaveBeenCalled();
                expect(addUnMatchedToMatchListMock).toHaveBeenCalled();
                expect(checkIfMutualMatchMock).toHaveBeenCalled();
                expect(body).toHaveProperty('isMutualMatch', true);
            });
            it('should return 200 and User added to matches if there is not a mutual match', async () => {
                const user1 = createUser();
                const user2 = createUser();
                const currentUserMatchList = {
                    userMatches: {
                        matches: []
                    }
                };
                const targetUserMatchList = {
                    userMatches: {
                        matches: []
                    }
                };
                Object.assign(user1, currentUserMatchList);
                Object.assign(user2, targetUserMatchList);
                const authUserMock = jest.spyOn(UserService, 'checkIfUserLoggedIn').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(user1);
                }));
                const findUserToAddForMatchListMock = jest.spyOn(UserService, 'findTargetUserToAddForMatchList').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(user2);
                }));
                const addUnMatchedToMatchListMock = jest.spyOn(UserService, 'addUnMatchedToMatchList').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(user2);
                }));
                const checkIfMutualMatchMock = jest.spyOn(UserService, 'checkMutalMatch').mockReturnValueOnce(new Promise((resolve, _) => {
                    return resolve(false);
                }));
                const jwt = getJwt(currentUser.email, currentUser._id.toString());
                const { body, status } = await supertest(app)
                    .post('/add-user/matchlist')
                    .send({ userProfileId: user1._id.toString() })
                    .set("Authorization", `Bearer ${jwt}`);
                expect(status).toBe(200);
                expect(body).toHaveProperty('message', 'User added to matches successfully!');
                expect(authUserMock).toHaveBeenCalled();
                expect(findUserToAddForMatchListMock).toHaveBeenCalled();
                expect(addUnMatchedToMatchListMock).toHaveBeenCalled();
                expect(checkIfMutualMatchMock).toHaveBeenCalled();
                expect(body).toHaveProperty('isMutualMatch', false);
            });
        });
    });
    // describe('ProfileController - updateExtendedUserProfile', ()=>{
    //     it('should return a 200', async () => {
    //         const { body } = await supertest(app).post('/user/update/userprofile').expect(200)
    //         expect(body).toHaveProperty('message', 'This is this ProfileTest Route!!!!!')
    //     })
    // })
    // describe('ProfileController - addUserToFavorites', ()=>{
    //     it('should return a 200', async () => {
    //         const { body } = await supertest(app).post('/add/favorites').expect(200)
    //         expect(body).toHaveProperty('message', 'This is this ProfileTest Route!!!!!')
    //     })
    // })
    // describe('ProfileController - removeUserFromFavorites', ()=>{
    //     it('should return a 200', async () => {
    //         const { body } = await supertest(app).post('/remove/favorites').expect(200)
    //         expect(body).toHaveProperty('message', 'This is this ProfileTest Route!!!!!')
    //     })
    // })
    // describe('ProfileController - addUserToBlockList', ()=>{
    //     it('should return a 200', async () => {
    //         const { body } = await supertest(app).post('/user/block/add').expect(200)
    //         expect(body).toHaveProperty('message', 'This is this ProfileTest Route!!!!!')
    //     })
    // })
    // describe('ProfileController - removeUserFromBlockList', ()=>{
    //     it('should return a 200', async () => {
    //         const { body } = await supertest(app).post('/user/block/remove').expect(200)
    //         expect(body).toHaveProperty('message', 'This is this ProfileTest Route!!!!!')
    //     })
    // })
});
//# sourceMappingURL=ProfileController.spec.js.map