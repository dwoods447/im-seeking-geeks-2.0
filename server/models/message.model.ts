import { Schema, Types, Model, model } from 'mongoose'
import { MessageType, MessageTypeMethods } from '../types/messages.js'
type MessageModel = Model<MessageType, {}, MessageTypeMethods>
const MessageSchema = new Schema<MessageType, MessageModel, MessageTypeMethods>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    id: {
      type: Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
    },
    random: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  recipient: {
    id: {
      type: Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
    },
    random: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  unread: {
    type: Boolean,
    required: true,
  },
})

MessageSchema.methods.markUserMessageAsRead = function () {
  this.unread = !!this.unread
  return this.save()
}

MessageSchema.methods.markMessageAsUnRead = function () {
  this.unread = !!this.unread
  return this.save()
}

const Message = model('Message', MessageSchema)
export default Message
