import express, { Response, Request } from 'express'; 
const router = express.Router();

import { body, check, validationResult } from 'express-validator'; 
const bcrypt = require('bcrypt'); 


import User from '../models/User';
import passport, { use } from "passport"; 

const userLoginValidation = [
    check("email").isEmail().withMessage("Please provide a valid email address."),
    check("password").notEmpty().withMessage("Password is required")
]

// @route   POST auth/login
// @desc    Login using email&password
// @access  Public
router.post("/login", userLoginValidation, async (req:Request, res:Response) => {
    try {
        const result = validationResult(req); 
        
        if (!result.isEmpty()) {
            return res.status(400).json({ errors : result.array() }); 
        }

        const { email, password } = req.body;
        let user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error : "Invalid email or password." });
        }

        const match = await bcrypt.compare(password, user.password); 
        if (!match) {
            return res.status(400).json({ error : "Invalid email or password."});
        }

        return res.status(200).json({ user }); 

    } catch(err) {
        console.log(err); 
        res.status(500).json({ msg : "Server error" });
    }
})

// @route   POST auth/signup
// @desc    Create a new account using email&password
// @access  Public
router.post("/signup", (req, res) => {

})

// GOOGLE OAUTH --------------------------------------------------------------------------------------

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
