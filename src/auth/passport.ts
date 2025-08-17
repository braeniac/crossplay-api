import dotenv from "dotenv";
dotenv.config(); 

import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
const AppleStrategy = require("passport-apple"); 

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
                    avatar: profile.photos?.[0]?.value,
                    accessToken, 
                    refreshToken
                })  
            }
            console.log(user); //DELETE
            await user.save(); 
            //err set to null means success.
            return cb(null, user); 
        } catch (err) {
            return cb(err); 
        }
    }
));

passport.use(
    new AppleStrategy({
        clientID: "",
        teamID: "",
        callbackURL: process.env.APPLE_CALLBACK_URL,
        keyID: "",
        privateKeyLocation: "",
        passReqToCallback: true
    }, 
    async (req : Request, accessToken : string , refreshToken : string , idToken : string, profile : any, cb : VerifyCallback ) => {
        try{
            //DB logic 
            let user = await User.findOne({ appleId : profile.id }); 

            if (!user) {
                user = await User.create({
                    appleId : profile.id, 
                    email: profile.email?.toLowerCase(), 
                    name: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : undefined,
                    accessToken, 
                    refreshToken, 
                    idToken
                })
            }

            await user.save(); 
            return cb(null, user); 
        } catch(err) {
            console.log(err);
            return cb(err); 
        }
    }
)); 

export default passport; 