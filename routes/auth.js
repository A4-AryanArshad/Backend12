const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendverificationcode = require('../middleware/Email');
const welcomeemail = require('../middleware/welcome');
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer');
const sendemail = require('../middleware/friend');

const fs = require('fs');
const path = require('path');


const JWT_SECRET = 'Sohailisthegreatboy'; // Renamed for clarity

const router = express.Router();




router.post('/updatebanner', async (req, res) => {


  const { email,path } = req.body;
  console.log(email)
  console.log(path)
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Construct the banner URL
    const bannerUrl = path;

    // Log the uploaded file and email for debugging
    console.log('Uploaded file:', bannerUrl);
    console.log('Email:', email);

    // Update user's banner field
    user.banner = bannerUrl;
    await user.save();

    // Send success response
    return res.status(200).json({ success: true, message: "Banner image uploaded successfully"});
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
});

// Upload profile image route
router.post('/updateprofile', async (req, res) => {
  const { email,path } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Construct the profile image URL
    const profileUrl = path;

    // Log the uploaded file and email for debugging
    console.log('Uploaded profile image:', profileUrl);
    console.log('Email:', email);

    // Update user's profile field
    user.profile = profileUrl;
    await user.save();

    // Send success response
    return res.status(200).json({ success: true, message: "Profile image uploaded successfully", profileUrl });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
});




































// Get images route
// Get banner route
router.post('/getbanner', async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (user && user.banner) {
      // Return the banner path
      return res.json({ path: user.banner });
    } else {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Get profile route
router.post('/getprofile', async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (user && user.profile) {
      // Return the profile image path
      return res.json({ path: user.profile });
    } else {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});






router.post('/updatename', async (req, res) => {
  const { email, name } = req.body; // Changed 'namee' to 'name' for clarity
  let success = false; // Removed redundant success variable

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
      // Update the user's name
      user.name = name; // Changed 'namee' to 'name' to match the incoming data key

      await user.save();

      // Return success response
      return res.json({ success: true, message: "Profile updated successfully" });
    }

    // If user is not found, return an error message
    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});























































router.post('/createuser', [
  body('name', 'Enter a valid name (at least 3 characters)').isLength({ min: 1 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { name, email, password } = req.body;
  console.log(name,email,password)

  try {





    // Check if the email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry, a user with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Check if this is a Google signup
    const isGoogleSignup = req.body.isGoogleSignup || false;

    console.log("Google Signin:", isGoogleSignup);

    // Generate OTP only for manual signups
    const verificationcode = isGoogleSignup ? null : Math.floor(100000 + Math.random() * 900000).toString();
    console.log(verificationcode)
    // Create new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      isverified: isGoogleSignup, // Automatically verify Google signups
      verificationcode: verificationcode, // Set OTP only for manual signups
    });

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, JWT_SECRET);

    success = true;

    // Send verification code only for manual signups
    if (!isGoogleSignup) {
      await sendverificationcode(user.email, user.verificationcode);
    }

    return res.status(200).json({ success, token, isverified: user.isverified });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});










router.post('/Forgot_verify', async (req, res) => {
  try {
    const { code, email } = req.body;

    console.log(code,email)
    // Check if all required fields are provided
    if (!code || !email) {
      return res.status(400).json({ success: false, message: "Code and email are required." });
    }

    // Find the user with the provided email and code
    const user = await User.findOne({ verificationcode: code, email });
      console.log(user)
      
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or Expired Code" });
    }

   console.log(user)

    user.isverified= true;
    await user.save();

    // Code verification successful
    return res.status(200).json({ success: true, message: "Email Verified Successfully" });

  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: "Server side Error" });
  }
});



router.post('/email_first_verify', async (req, res) => {
  try {
    const { code, email } = req.body;

    console.log(code,email)
    // Check if all required fields are provided
    if (!code || !email) {
      return res.status(400).json({ success: false, message: "Code and email are required." });
    }

    // Find the user with the provided email and code
    const user = await User.findOne({ verificationcode: code, email });
      console.log(user)
      
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or Expired Code" });
    }

   console.log(user)

    user.isverified= true;
    await user.save();

    await welcomeemail(user.name, user.email);
    return res.status(200).json({ success: true, message: "Email Verified Successfully" });

  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: "Server side Error" });
  }
});














// Endpoint to get the user's name based on their ID
router.post('/getownername', async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'Owner ID is required.' });
    }

    const user = await User.findById(ownerId).select('name');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, name: user.name });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: "Server side Error" });
  }
});
















router.post('/reset-password', async (req, res) => {
  try {
    const { email,password } = req.body;


   
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or Expired Code" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    user.password = secPass;

    await user.save();

   
    
    return res.status(200).json({ success: true, message: "Password Reset Successfully " });

  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, message: "Server side Error" });
  }
});
























// Resend OTP route
router.post('/reverify', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a new verification code
    const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationcode = newVerificationCode;
    await user.save();

    // Send the verification code to user's email
    await sendverificationcode(user.email, newVerificationCode);

    return res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});













router.post('/friend', async (req, res) => {
  let success = false;
  try {
      const email = req.body.email;
      const nftLink = "http://localhost:3000/"; // Replace with the actual NFT link
      success = true;
      await sendemail(email, nftLink); // Send the email with the NFT link
      res.json({ success });
  } catch (error) {
      console.error("Error sending email:", error.message);
      res.status(500).json({ success, message: "Internal Server Error" });
  }
});











router.post('/login', [
  body('email', 'Enter valid email e.g email123@gmail.com').isEmail(),
  body('password', 'Enter a valid password e.g pass123 > 5 ').isLength({ min: 5 }),
], async (req, res) => {


  let success = false;
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log(email,password)

  try {
    // Check if the user exists

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
    }
 
 
    const passCompare = await bcrypt.compare(password, user.password);
    console.log("compare ", passCompare)
      if (!passCompare) {
        return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
      }
    

   
    if (!user.isverified) {
      return res.status(400).json({ success: true, verify: false, error: 'Please verify the Email first' });
    }

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, JWT_SECRET);
    success = true;


    return res.json({ success, token, verify: true });
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.status(500).json({ success: false, error: 'Some error occurred' });
  }
});










router.post('/google-signin', async (req, res) => {
  const { email, name } = req.body;
  let success = false;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if they don't exist
      const password = Math.random().toString(36).slice(-8); 

      console.log("password",password)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);



      

      user = new User({
        name,
        email,
        password: hashedPassword,
        isverified: true, 
        verificationcode: null, 
      });

      await user.save();
    }

    // Generate JWT token
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, JWT_SECRET);
    success = true;

    return res.json({ success, token, verify: true });
  } catch (error) {
    console.error('Error during Google Sign-In:', error.message);
    return res.status(500).json({ success: false, error: 'Some error occurred' });
  }
});



// Get user data route
router.post('/getdata', fetchuser, async (req, res) => {
  let success = false;
  try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password"); // Exclude password from response
    success = true;
    res.json({ success, user });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});





router.post('/emailverify', async (req, res) => {
  let success = false;

  // Extract email
  const { email } = req.body;



  // Log email for debugging
  console.log('Email received:', email);

  if (!email) {
    return res.status(400).json({ success, error: 'Email is required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success, error: 'User not found. Please check your email.' });
    }

    // If user found, set success to true
    success = true;
    return res.status(200).json({ success});
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return res.status(500).json({ success, message: 'Internal Server Error' });
  }
});


module.exports = router;
