import express from 'express'; 
const router = express.Router(); 

import passport from "passport"; 

// @route   POST auth/login
// @desc    Login using email&password
// @access  Public
router.post("/login", (req, res) => {

})

// @route   POST auth/signup
// @desc    Create a new account using email&password
// @access  Public
router.post("/signup", (req, res) => {

})

// @route   GET /auth/google/callback
// @desc    Google OAuth2.0 callback endpoint – handles authentication response and logs in user
// @access  Public
router.get("/google/callback", passport.authenticate('google',  
    { failureRedirect: '/login' }),  
    (_, res) => {
        //successful authentication.
        res.redirect('/');
    }
); 

// @route   GET auth/google
// @desc    Initiate Google OAuth2.0 login flow
// @access  Public
router.get("/google", passport.authenticate('google', { scope : ['profile', 'email']})); 

export default router; 
