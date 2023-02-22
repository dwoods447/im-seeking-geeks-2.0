import { faker } from '@faker-js/faker'
import { MessageType } from 'types/messages'
import { userOneId, userTwoId } from './users.mock'


export const today = new Date()
export const messages: MessageType[]  = [
    {
        content: 'This is the initial message',
        sender:{
            id: {
                type: userOneId,
                ref: 'User'
            },
            
        },
        username: faker.internet.userName(),
        imageSrc: '',
        random: 'true',
        gender:'male',
        recipient: {
            id: {
                type: userTwoId,
                ref: 'User'
            },
            username: faker.internet.userName(),
            imageSrc: '',
            random: 'true',
            gender:'female',
        }, 
        date: today,
        unread: faker.datatype.boolean()
    },
    {
        content: 'This is the follow up meesage',
        sender:{
            id: {
                type: userTwoId,
                ref: 'User'
            },
        },
        username: faker.internet.userName(),
        imageSrc: '',
        random: 'true',
        gender:'male',
        recipient: {
         
            id: {
                type: userOneId,
                ref: 'User'
            },
            username: faker.internet.userName(),
            imageSrc: '',
            random: 'true',
            gender:'female',
        }, 
        date: today,
        unread: faker.datatype.boolean()
    },
]

