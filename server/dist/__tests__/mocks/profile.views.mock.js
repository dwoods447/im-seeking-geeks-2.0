import { Types } from 'mongoose';
export const profileViews = [
    {
        userId: {
            type: new Types.ObjectId(), ref: 'User'
        },
        date: {
            type: new Date()
        }
    }
];
//# sourceMappingURL=profile.views.mock.js.map