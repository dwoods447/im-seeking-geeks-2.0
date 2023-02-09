import { Schema, Types } from 'mongoose'
import { UserType } from '../types/users.js'
export interface MessageType {
    content: string,
    sender: {
       id: {
        type: Types.ObjectId,
        ref: 'User'
       }
    },
    username: string,
    imageSrc?: string,
    random?:string,
    gender?:string,
    recipient: {
        id: {
          type: Types.ObjectId,
          ref: 'User'
        },
        username: string,
        imageSrc?: string,
        random?:string,
        gender?:string,
    },
    date: Date,
    unread: boolean
}