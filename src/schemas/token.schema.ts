import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: any }) {
    delete ret._id;
}

export const TokenSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            required: [true, 'User can not be empty'],
        },
        token: {
            type: String,
            required: [true, 'Token can not be empty'],
        },
    },
    {
        toObject: {
            virtuals: false,
            versionKey: false,
            transform: transformValue,
        },
        toJSON: {
            virtuals: false,
            versionKey: false,
            transform: transformValue,
        },
    },
);