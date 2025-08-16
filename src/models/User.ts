import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId ?: string,
    appleId ?: string, 
    email ?: string, 
    password ?: string, 
    name ?: string, 
    avatar ?: string 
}

const UserSchema = new Schema<IUser>({
    googleId: {
        type: String, 
        unique: true,
        sparse: true
    },
    appleId: {
        type: String, 
        unique: true, 
        sparse: true
    },
    email: {
        type: String, 
        unique: true,
        sparse: true
    },
    name: {
        type: String
    },
    password: {
        type: String, 
    },
    avatar: {
        type: String
    }
})

const User = mongoose.model<IUser>('User', UserSchema); 

export default User;