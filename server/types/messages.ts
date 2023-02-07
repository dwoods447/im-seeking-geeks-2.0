import mongoose from 'mongoose'
import { UserType } from '../types/users'
export interface MessageType {
    content: string,
    sender: {
       id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserType
       }
    },
    username: string,
    imageSrc?: string,
    random?:string,
    gender?:string,
    recipient: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: UserType
        },
        username: string,
        imageSrc?: string,
        random?:string,
        gender?:string,
    },
    date: Date,
    unread: boolean
}