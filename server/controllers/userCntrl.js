const asyncHandler = require('express-async-handler');
const {User} = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {generateverificationToken,sendVerificationEmail} = require('../utils/email');
const {successFullVerification,gmailContent} = require('../utils/emailTemplate')

const userInfo = asyncHandler(async (req,res) => {
    res.json(req.user);
});

const registerUser = asyncHandler(async(req,res)=>{
    const {uname, email, password, phoneNo, emergencyNo, emergencyMail, pinCode} = req.body; // Updated field names to match model
    console.log(uname)
    if(!uname || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory baby");
    }

    const userAvailable = await User.findOne({email: email});
    if(userAvailable){
        res.status(400).json({message: "Email already exists"});
        
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            uname,
            email,
            password: hashedPassword,
            phoneNo,
            emergencyMail,
            emergencyNo: Number(emergencyNo), // Convert to number
            pinCode: Number(pinCode), // Convert to number
            isVerified: true // Automatically set as verified
        });

        if (!user) {
            throw new Error('Failed to create user');
        }

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                uname: user.uname
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: error.message || 'Registration failed. Please try again later.'
        });
    }

    if (!user) {
        res.status(500).json({ message: 'Failed to create user' });
        return;
    }

    await sendVerificationEmail(email, verificationToken);


    try {
        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                uname: user.uname
            }
        });
    } catch (error) {
        await user.deleteOne(); // Clean up the user if email sending fails
        res.status(500).json({ message: 'Failed to send verification email' });
    }
});

const verifyemail = async (req, res) => {
    try {
        const tokenId = req.params.tokenId;
        const user = await User.findOne({ verificationToken: tokenId });

        if (!user) {
            return res.status(404).json({ error: 'Invalid verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        const congratulationContent = successFullVerification();

        res.status(200).send(congratulationContent);

    } catch (error) {
        res.status(500).json({ error: 'An error occurred during email verification.' });
        console.log(error);
    }
};

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Automatically set user as verified if not already
        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        const accessToken = jwt.sign({
            user: {
                uname: user.uname,
                email: user.email,
                id: user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1yr" });

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                uname: user.uname
            },
            token: accessToken
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const profileUpdate = asyncHandler(async(req,res) => {
    const {uid,uname,email,phoneNo,address,pincode,emergencyMail,emergencyNo,extraEmail1,extraEmail2,extraPhone1,extraPhone2} = req.body;
    const user = await User.findById(uid);
    if(user){
        user.uname = uname,
        user.email = email,
        user.phoneNo = phoneNo,
        user.address = address,
        user.pinCode = pincode,
        user.emergencyMail = emergencyMail,
        user.emergencyNo = emergencyNo,
        user.extraEmail1 = extraEmail1,
        user.extraEmail2 = extraEmail2,
        user.extraPhone1 = extraPhone1,
        user.extraPhone2 = extraPhone2

        await user.save()
        res.status(200).json({message: "User updated successfully"})
    }else{
        res.status(404).json({message: "Something went wrong"})
    }
     
})







       



module.exports = {
    userInfo,
    registerUser,
    loginUser,
    verifyemail,
    profileUpdate

}