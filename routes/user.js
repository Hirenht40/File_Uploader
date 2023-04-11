const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken')

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { loginUser, signupUser } = require('../controller/userController');
require('dotenv').config();
const User = require("../models/userModel")

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
  }


const router = express.Router();

// Add express-session middleware
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport.js middleware after session middleware
router.use(passport.initialize());
router.use(passport.session());

// Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: '/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // You can perform some action with the user's Google profile here
  console.log(profile);
  done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


  
  
  router.post('/google-login', async (req, res) => {
    try {
      // Extract email and Google ID from the request body
      const { email, googleId } = req.body;
  
      // Check if the user already exists in the database
      let user = await User.findOne({ email });
  
      if (!user) {
        // If the user does not exist, create a new user with the email and Google ID
        user = await User.create({
          email,
          googleId
        });
      } else {
        // If the user already exists, update the Google ID
        user.googleId = googleId;
        await user.save();
      }
  
      // Create a JSON Web Token for the user
      const token = createToken(user._id);
      console.log(token)
  
      // Send a response with the email and JSON Web Token
      res.status(200).json({
        email,
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
  });

  
// Login and signup routes
router.post('/login', loginUser);
router.post('/signup', signupUser);

module.exports = router;
