const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//reset password token
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }
        //generate token
        const token = crypto.randomUUID();

        //update user in db by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,//after this time, not able to reset password
            },
            { new: true }//updted document will be returned
        );
        console.log("DETAILS", updatedDetails);

        //createurl(link)
        const url = `http://localhost:3000/update-password/${token}`;//added token so that unique links will be created

        //send mail containing link to reset pwd
        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        res.json({
            success: true,
            message:
                "Email Sent Successfully, Please Check Your Email to change password",
        });
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset passwordd`,
        });
    }
};
//in above function, made token and added to user in DB, so that we can acces user and change pwd in below fuction, without token we would not have any way of accessing user

//reset pwd
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;//frontend put the token in body

        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Password and Confirm Password Does not Match",
            });
        }

        //get user details from DB using token
        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid",
            });
        }

        //check if resetpwd time has expired
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: `Token is Expired, Please Regenerate Your Token`,
            });
        }

        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        );
        return res.json({
            success: true,
            message: `Password Reset Successful`,
        });
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        });
    }
};