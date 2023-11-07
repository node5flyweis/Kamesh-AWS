const User = require("../Models/userModel");
const dotenv = require("dotenv");
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const config = require('config');
// const multer = require('multer');
const randomatic = require('randomatic');

const cloudinary = require('cloudinary').v2;
// const twilio = require('twilio');

// Initialize Twilio client
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );
cloudinary.config({ 
  cloud_name: 'dtijhcmaa', 
  api_key: '624644714628939', 
  api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
});
  exports.registerUser = async (req, res) => {
    try {
        const mobileNumber = req.body.mobileNumber;
        const existingUser = await User.findOne({ mobileNumber, role: 'user' });
        if (existingUser) {
          return res.status(400).json({ error: 'User with this mobile number already exists' });
        }
    
        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    
        // Save the generated OTP to the user's record in the database
        const user = await User.findOneAndUpdate(
          { mobileNumber },
          { otp },
          { new: true, upsert: true }
        );
    
        // Send OTP via SMS using Twilio
        // ...
    
        res.json({ message: 'OTP sent successfully',user });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    exports.loginUser = async (req, res) => {
      try {
        const { mobileNumber } = req.body;
    
        // Check if the user exists in the database
        let user = await User.findOne({ mobileNumber });
    
        if (!user) {
          // If the user is not found, register them
          const otp = randomatic('0', 4); // Generate a 4-digit OTP
          user = new User({
            mobileNumber,
            otp,
          });
    
          // Save the user to the database
          await user.save();
    
          // Send OTP to the user via SMS or any other preferred method
          // Example: SMSService.sendOTP(mobileNumber, otp);
    
          res.json({ message: 'OTP generated and sent to the user', user });
        } else {
          // If the user already exists, generate a new OTP
          const otp = randomatic('0', 4); // Generate a new 4-digit OTP
          user.otp = otp;
          user.isVerified = false;
    
          // Save the updated OTP to the user's record in the database
          await user.save();
    
          // Send the new OTP to the user via SMS or any other preferred method
          // Example: SMSService.sendOTP(mobileNumber, otp);
    
          res.json({ message: 'New OTP generated and sent to the user', user });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    exports.verifyOtp = async (req, res) => {

        try {
            const mobileNumber = req.body.mobileNumber;
            const otp = req.body.otp;
        // console.log(mobileNumber);
        // console.log(otp);
            // Fetch the user's record from the database based on the mobile number
            const user = await User.findOne({ mobileNumber });
        // console.log(user);
            if (!user) {
              // User not found, handle accordingly
              return res.status(404).json({ error: 'User not found' });
            }
        
            // Check if the provided OTP matches the one saved in the user's record
            if (user.otp !== otp) {
              // Invalid OTP, handle accordingly
              return res.status(400).json({ error: 'Invalid OTP' });
            }
        
            // OTP is valid, save the user in the database
            user.isVerified = true;
            await user.save();
        
           // Check if the user is verified
    if (user.isVerified) {
        // Generate a JWT token
        // const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
        const token = jwt.sign({ id: user._id }, "node5flyweis");
        res.json({ message: 'OTP verification successful.', token,user });
      } else {
        res.status(401).json({ error: 'User not verified' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  exports.resendOtp = async (req, res) => {

  try {
    const { mobileNumber } = req.body;

    // Query the database to find the user by email
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate and send a new OTP to the user's email
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });


    // Update the user's OTP in the database
    user.otp = otp;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP resent successfully',otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
