import express, { Request, Response } from 'express';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken"; 


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try{
                let user = await User.findOne({ googleId: profile.id });

                //user not found, create new user.
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails?.[0].value,
                        name: profile.displayName,
                        avatar: profile.photos?.[0].value
                    });
                }
                return done(null, user); 
            } catch(error){
               return done(error, ); 
            }
        }
    )
)

passport.authenticate("google", { session : false}, 

    (req : Request, res : Response) => {

        const user = req.user as IUser; 
        const token = jwt.sign(
            { id : user._id} , 
            process.env.JWT_SECRET as string, 
            { expiresIn : "7d" }); 

        res.redirect(`${process.env.FRONTEND_URL}/auth/sucess?token${token}`);
        
    }
)


export default passport;