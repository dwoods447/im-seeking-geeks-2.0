import mongoose from 'mongoose';
import Message from '../models/message.model.js';
const ProfileService = {
    async getTotalMessageCountForUser(userId) {
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
        ]);
        return totalItems[0].total_messages;
    },
    async getMessagesForAuthenticatedUser(userId) {
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
        ]);
        return authUsersMessages;
    },
    async getMessageThreadForUsers(loggedInUserId, targetUserId) {
        const messagesThreadOne = await Message.find({ $and: [{ 'recipient.id': new mongoose.Types.ObjectId(targetUserId), 'sender.id': new mongoose.Types.ObjectId(loggedInUserId) }] }).select(['content', 'date', 'sender.id', 'recipient.id', 'sender.imageSrc', 'recipient.imageSrc', 'sender.random', 'recipient.gender', 'recipient.random', 'sender.gender', 'unread', 'sender.username', 'recipient.username']);
        const messagesThreadTwo = await Message.find({ $and: [{ 'recipient.id': new mongoose.Types.ObjectId(loggedInUserId) }, { 'sender.id': new mongoose.Types.ObjectId(targetUserId) }] }).select(['content', 'date', 'sender.id', 'recipient.id', 'recipient.imageSrc', 'sender.imageSrc', 'sender.random', 'recipient.random', 'sender.gender', 'recipient.gender', 'unread', 'sender.username', 'recipient.username']);
        const messagesThread = [...messagesThreadOne, ...messagesThreadTwo];
        const sortedMessages = messagesThread.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            if (aDate < bDate) {
                return -1;
            }
            if (aDate > bDate) {
                return 1;
            }
            return 0;
        });
        return sortedMessages;
    },
    async getSentMessagesForLoggedInUser(userId) {
        const mySentMesages = await Message.aggregate([
            {
                $match: { 'sender.id': new mongoose.Types.ObjectId(userId) }
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
                            senderGender: '$sender.gender'
                        }
                    }
                }
            },
            {
                $sort: { 'messageContent.date': -1 }
            }
        ]);
        return mySentMesages;
    }
};
export default ProfileService;
//# sourceMappingURL=ProfileService.js.map