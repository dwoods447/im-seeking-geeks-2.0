import mongoose from 'mongoose'
import { MessageType } from '../types/messages'





const { Schema } = mongoose


const MessageSchema = new Schema<MessageType>({
    content: {
        type: String,
        required: true
      },
      sender: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        username: {
          type: String,
          required: true
        },
        imageSrc: {
          type: String
        },
        random: {
          type: String
        },
        gender: {
          type: String
        }

      },
      recipient: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        username: {
          type: String,
          required: true
        },
        imageSrc: {
          type: String
        },
        random: {
          type: String
        },
        gender: {
          type: String
        }
      },
      date: {
        type: Date,
        required: true
      },
      unread: {
        type: Boolean,
        required: true
      }
})

MessageSchema.methods.markUserMessageAsRead = function () {
    this.unread = !!this.unread
    return this.save()
  }

  MessageSchema.methods.markMessageAsUnRead = function () {
    this.unread = !!this.unread
    return this.save()
  }

const Message = mongoose.model('Message', MessageSchema)
export default Message