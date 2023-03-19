import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import sendGridTransport from 'nodemailer-sendgrid'
import { MessageType } from 'types/messages.js'
import User from '../models/user.model.js'
import { Types, Document } from 'mongoose'
import Message from '../models/message.model.js'
import { defaultConfig } from '../config/default.server.js'
import { basicUser, advancedUser, UserType } from '../types/users.js'

import fetch from 'node-fetch'

const ProfileService = {
  async getTotalMessageCountForUser(userId: string): Promise<any> {
    try {
      const msgItems = await Message.aggregate([
        {
          $match: {
            'recipient.id': new Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: { from: '$sender.id' },
            messageContent: {
              $push: {
                messageId: '$_id',
                sender: '$sender.username',
                image: '$sender.imageSrc',
                date: '$date',
                content: '$content',
                unread: '$unread',
                random: '$sender.random',
                gender: '$sender.gender',
              },
            },
          },
        },
        {
          $count: 'total_messages',
        },
      ])
      return msgItems
    } catch (error) {
      throw new Error(error)
    }
  },
  async getMessagesForAuthenticatedUser(userId: string): Promise<MessageType[] | []> {
    try {
      const authUsersMessages = await Message.aggregate([
        {
          $match: {
            'recipient.id': new Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: { from: '$sender.id' },
            messageContent: {
              $push: {
                messageId: '$_id',
                sender: '$sender.username',
                image: '$sender.imageSrc',
                date: '$date',
                content: '$content',
                unread: '$unread',
                random: '$sender.random',
                gender: '$sender.gender',
              },
            },
          },
        },
        {
          $sort: { 'messageContent.date': -1 },
        },
        // { $skip : (currentPage  - 1 ) *  perPage },
        // { $limit:  perPage},
      ])
      return authUsersMessages
    } catch (error) {
      throw new Error(error)
    }
  },
  async getMessageThreadForUsers(loggedInUserId: string, targetUserId: string): Promise<MessageType[] | []> {
    try {
      const messagesThreadOne = await Message.find({
        $and: [
          {
            'recipient.id': new mongoose.Types.ObjectId(targetUserId),
            'sender.id': new mongoose.Types.ObjectId(loggedInUserId),
          },
        ],
      }).select([
        'content',
        'date',
        'sender.id',
        'recipient.id',
        'sender.imageSrc',
        'recipient.imageSrc',
        'sender.random',
        'recipient.gender',
        'recipient.random',
        'sender.gender',
        'unread',
        'sender.username',
        'recipient.username',
      ])
      const messagesThreadTwo = await Message.find({
        $and: [
          {
            'recipient.id': new mongoose.Types.ObjectId(loggedInUserId),
          },
          { 'sender.id': new mongoose.Types.ObjectId(targetUserId) },
        ],
      }).select([
        'content',
        'date',
        'sender.id',
        'recipient.id',
        'recipient.imageSrc',
        'sender.imageSrc',
        'sender.random',
        'recipient.random',
        'sender.gender',
        'recipient.gender',
        'unread',
        'sender.username',
        'recipient.username',
      ])
      const messagesThread = [...messagesThreadOne, ...messagesThreadTwo]
      const sortedMessages = messagesThread.sort((a, b) => {
        const aDate = new Date(a.date)
        const bDate = new Date(b.date)
        if (aDate < bDate) {
          return -1
        }
        if (aDate > bDate) {
          return 1
        }
        return 0
      })
      return sortedMessages
    } catch (error) {
      throw new Error(error)
    }
  },

  async getSentMessagesForLoggedInUser(userId: string): Promise<MessageType[] | []> {
    try {
      const mySentMesages = await Message.aggregate([
        {
          $match: {
            'sender.id': new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: { to: '$recipient.id' },
            messageContent: {
              $push: {
                messageId: '$_id',
                receiver: '$recipient.username',
                sender: '$sender.username',
                image: '$recipient.imageSrc',
                date: '$date',
                content: '$content',
                unread: '$unread',
                random: '$recipient.random',
                receiverGender: '$recipient.gender',
                senderGender: '$sender.gender',
              },
            },
          },
        },
        {
          $sort: { 'messageContent.date': -1 },
        },
      ])
      return mySentMesages
    } catch (error) {
      throw new Error(error)
    }
  },
  async fetchZipCodeData(postalCode: string, miles: string) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': `${defaultConfig.REDLINE_API.APP_KEY}`,
        'X-RapidAPI-Host': `${defaultConfig.REDLINE_API.APP_HOST}`,
      },
    }
    try {
      const zipCodesObjs = await fetch(
        `${defaultConfig.REDLINE_API.APP_URI}/rest/radius.json/${postalCode}/${miles}/mile`,
        options
      )
      // const zipCodesObjs = await fetch(
      //     `${defaultConfig.ZIPCODE_API.URL}/${defaultConfig.ZIPCODE_API.API_KEY}/radius.json/${postalCode}/${miles}/mile`,
      // )
      const zipcodes = await zipCodesObjs.json()
      // console.log(`${JSON.stringify(zipcodes)} ${postalCode} ${miles}`)
      if (zipcodes.error_code) {
        throw new Error(zipcodes.error_code)
      }
      const zipCodes = zipcodes.zip_codes.map((obj: { zip_code: string }) => {
        return obj.zip_code
      })

      return zipCodes
    } catch (error) {
      throw new Error(error)
    }
  },

  async basicUserSearchQuery(userId: string, searchParams: basicUser) {
    try {
      const userWhoHaveNotBlockedYou = {
        'blockedUsers.users.userId': {
          $not: { $eq: new Types.ObjectId(userId) },
        },
      }
      const notYou = {
        _id: { $not: { $eq: new Types.ObjectId(userId) } },
      }

      const requestedParams = {
        ...searchParams,
        $and: [{ ...userWhoHaveNotBlockedYou, ...notYou }],
      }

      const searchedUsers = await User.find(requestedParams, {
        password: 0,
      })

      return searchedUsers
    } catch (error) {
      throw new Error(error)
    }
  },
  async advancedUserSearchQuery<S extends string, T>(userId: S, searchParams: T) {
    try {
      const userWhoHaveNotBlockedYou = {
        'blockedUsers.users.userId': {
          $not: { $eq: new Types.ObjectId(userId) },
        },
      }
      const notYou = {
        _id: { $not: { $eq: new Types.ObjectId(userId) } },
      }

      const requestedParams = {
        ...searchParams,
        $and: [{ ...userWhoHaveNotBlockedYou, ...notYou }],
      }
      const searchedUsers = await User.find(requestedParams, {
        password: 0,
      })
      return searchedUsers
    } catch (error) {
      throw new Error(error)
    }
  },
  async findMessage(messageId: string) {
    try {
      const message = await Message.findById({ _id: messageId })
      return message
    } catch (error) {
      throw new Error(error)
    }
  },
  async markMessageAsRead(message: MessageType) {
    try {
      await message.markUserMessageAsRead(message)
    } catch (error) {
      throw new Error(error)
    }
  },
  async sendMessageToUser(
    sender: UserType,
    receiverOfMessage: UserType,
    senderImageSource: string,
    recieverImageSource: string,
    message: string
  ) {
    try {
      const createdMessage = new Message({
        content: message,
        sender: {
          id: new Types.ObjectId(sender._id),
          imageSrc: senderImageSource,
          username: sender.username,
          random: sender.random,
          gender: sender.gender,
        },
        recipient: {
          id: new Types.ObjectId(receiverOfMessage._id),
          imageSrc: recieverImageSource,
          username: receiverOfMessage.username,
          random: receiverOfMessage.random,
          gender: receiverOfMessage.gender,
        },
        date: new Date(),
        unread: true,
      })
      const savedMessage = await createdMessage.save()
      return savedMessage
    } catch (error) {
      throw new Error(error)
    }
  },
  sendNewEmail(emailObject: { to: string; bcc?: string; from: string; subject: string; html: string }) {
    const transporter = nodemailer.createTransport(
      sendGridTransport({
        apiKey: defaultConfig.node_mailer_key,
      })
    )

    try {
      transporter.sendMail({
        ...emailObject,
      })
    } catch (error) {
      console.log(error)
    }
  },
}

export default ProfileService
