import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";


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


export default passport;