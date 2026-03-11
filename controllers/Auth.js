const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()


// Send OTP For Email Verification during signup
exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body

        // Check if user is already present
        const checkUserPresent = await User.findOne({ email })

        // If user found with provided email
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            })
        }

        //user not found, so generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        const result = await OTP.findOne({ otp: otp })//await==1 means generated otp is not unique

        //while unique otp is not generated, genrate new otp
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            const result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp }//otp model also asks for createdAt, but if we not give, it will take default value date.now
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody)
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}