import mongoose, { Document } from 'mongoose';

export interface IToken extends Document {
    user_id: mongoose.Types.ObjectId;
    token: string;
}