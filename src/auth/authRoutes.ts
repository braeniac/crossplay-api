import express, { Response, Request } from 'express'; 
const router = express.Router();
import User from '../models/User';
import { check, validationResult } from 'express-validator'; 
const bcrypt = require('bcrypt'); 
const jwt = require("jsonwebtoken"); 
import passport from "passport"; 

const userLoginValidation = [
    check("email").isEmail().withMessage("Please provide a valid email address."),
    check("password").notEmpty().withMessage("Password is required")
];

// @route   POST auth/login
// @desc    Login using email&password
// @access  Public
router.post("/login", userLoginValidation, async (req : Request, res : Response) => {
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
}); 

const createUserValidation = [
   check("name", "name is required")
    .not()
    .isEmpty(), 
   check("email", "Please include a valid email")
    .isEmail(), 
   check("password")
    .isLength({ min : 6, max: 20})
    .withMessage("Password must be between 6 and 20 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")
]; 

// @route   POST auth/signup
// @desc    Create a new account using email&password
// @access  Public
router.post("/signup", createUserValidation, async (req : Request, res : Response) => {
    try { 

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors : result.array() }); 
        }

        const { name, email, password } = req.body; 

        let user = await User.findOne({ email }); 

        if (user) {
            return res.status(400).json({ errors : [{ msg : 'User already exists' }] }); 
        }
        
        user = new User({
            name, 
            email, 
            password
        })
        
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds); 
        user.password = hash; 
        await user.save();

        //jsonwebtoken (jwt)
        const payload = { userId : user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : "1h" }); 

        return res.status(201).json({ 
            token, 
            user: {
                id: user._id, 
                name : user.name,
                email : user.email
            }    
        });  
        
    } catch(err) {
        console.log(err); 
        res.status(500).json({ msg : "Sever error." }); 
    }
})

// GOOGLE OAUTH --------------------------------------------------------------------------------------

// @route   GET /auth/google/callback
// @desc    Google OAuth2.0 callback endpoint – handles authentication response and logs in user
// @access  Public
router.get("/google/callback", passport.authenticate('google',  
    { failureRedirect: '/login' }),  
    (req, res) => {
        //successful authentication.
        res.redirect('/');
    }
); 

// @route   GET auth/google
// @desc    Initiate Google OAuth2.0 login flow
// @access  Public
router.get("/google", passport.authenticate('google', { scope : ['profile', 'email']})); 

// APPLE OAUTH ----------------------------------------------------------------------------------------

router.get("/apple/callback", passport.authenticate('apple',
    { failureRedirect: '/login' }),  
    (req, res) => {
        //successful authentication.
        res.redirect('/');
    }
);

// @route    GET auth/apple
// @desc     Initiate Google OAuth2.0 login flow
// @access   Public 
router.get("/apple", passport.authenticate('apple', { scope : ['profile', 'email']})); 


// SPOTIFY OAUTH --------------------------------------------------------------------------------------

router.get("")


export default router; 
