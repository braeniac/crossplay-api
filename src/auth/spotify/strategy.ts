import { Request } from "express";
import passport from "passport";
import { Strategy as SpotifyStrategy, Profile as SpotifyProfile } from "passport-spotify";

export function configureSpotifyStrategy() {
    passport.use(new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            callbackURL: process.env.SPOTIFY_REDIRECT_URI!,
            passReqToCallback: true
        }, 
        async (
            req : Request, 
            accessToken : string, 
            refreshToken : string, 
            expires_in: number, 
            profile : SpotifyProfile, 
            done
        ) => {
            try {
                return done(null, {
                    accessToken,
                    refreshToken,
                    expiresIn: expires_in,
                    profile,
                });
            } catch(err) {
                const error = err instanceof Error ? err : new Error("Unknown error in Spotify verify callback"); 
                return done(error); 
            }
        }
    ))
}