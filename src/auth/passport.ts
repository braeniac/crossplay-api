import dotenv from "dotenv";
dotenv.config(); 

import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
//models
import User from "../models/User";

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!
    },
    async (accessToken : string, refreshToken : string, profile : Profile, cb : VerifyCallback) => {
        try{ 
            let user = await User.findOne({ googleId : profile.id });
            //if user doesn't exist
            if (!user) {
                user = await User.create({
                    googleId: profile.id, 
                    email: profile.emails?.[0]?.value?.toLowerCase(), 
                    name: profile.displayName, 
                    avatar: profile.photos?.[0]?.value
                })  
            }

            console.log(user); 
            await user.save(); 
            //err set to null means success.
            return cb(null, user); 
        } catch (err) {
            return cb(err); 
        }
    }
));

export default passport; 