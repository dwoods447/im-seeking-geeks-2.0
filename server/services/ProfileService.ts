import mongoose from 'mongoose'
import User from '../models/user.model.js'
import Message from '../models/message.model.js'




const ProfileService = {
  async getTotalMessageCountForUser(userId :string){
    const totalItems = await Message.aggregate([
      {
        $match: { 'recipient.id': new mongoose.Types.ObjectId(userId) }
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
              gender: '$sender.gender'
            }
          }
        }
  
      },
      {
        $count: 'total_messages'
      }
  
    ])

    return totalItems
  }, 
  async getMessagesForAuthenticatedUser(userId :string){
    const authUsersMessages = await Message.aggregate([
      {
        $match: { 'recipient.id': new mongoose.Types.ObjectId(userId) }
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
              gender: '$sender.gender'
            }
          }
        }
      },
      {
        $sort: { 'messageContent.date': -1 }
      }
      // { $skip : (currentPage  - 1 ) *  perPage },
      // { $limit:  perPage},
  
    ])
    return authUsersMessages
  },
}



export default  ProfileService