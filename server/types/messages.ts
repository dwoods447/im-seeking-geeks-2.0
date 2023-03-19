import { Types } from 'mongoose'

export interface MessageType {
  _id: Types.ObjectId
  content: string
  sender: {
    id: {
      type: Types.ObjectId
      ref: 'User'
    }
  }
  username: string
  imageSrc?: string
  random?: string
  gender?: string
  recipient: {
    id: {
      type: Types.ObjectId
      ref: 'User'
    }
    username: string
    imageSrc?: string
    random?: string
    gender?: string
  }
  date: Date
  unread: boolean
  markUserMessageAsRead(message: MessageType): MessageType
  markMessageAsUnRead(message: MessageType): MessageType
}
export interface MessageTypeMethods {
  markUserMessageAsRead(message: MessageType): MessageType
  markMessageAsUnRead(message: MessageType): MessageType
}
