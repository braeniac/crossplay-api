import mongoose, { Schema } from 'mongoose';

const SpotifySchema = new Schema({
    accountId: String, 
    refreshTokenEnc: {
        type: String, 
        select: false
    },
    country: String, 
}, { _id : false }); 

const AppleSchema = new Schema({
    musicUserTokenEnc: {
        type: String, 
        select: false
    }, 
    storefront: String
}, { _id : false }); 

const YouTubeSchema = new Schema({
    channelId: String, 
    refreshTokenEnc: {
        type : String, 
        select: false
    }
}, { _id : false }); 

const ProviderAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        index: true, 
        required: true
    }, 
    platform: {
        type: String, 
        enum: ["spotify", "apple", "youtube"],
        required: true, 
        lowercase: true, 
        trim: true
    },
    accessTokenEnc: {
        type: String, 
        select: false
    },
    tokenType: {
        type: String, 
        default: "Bearer"
    },
    expiresAt: Date,
    scopes: [String],
    lastConnectedAt: Date, 
    lastErrorAt: Date, 
    lastError: String, 

    spotify: {
        type: SpotifySchema,
        default: undefined
    },
    apple: {
        type: AppleSchema, 
        default: undefined
    },
    youtube: {
        type: YouTubeSchema, 
        default: undefined
    }

}, {timestamps : true}); 

export default mongoose.model("ProviderAccount", ProviderAccountSchema); 