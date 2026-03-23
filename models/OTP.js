const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,//expires automatically in 5 minutes
    },
});

//function to send mails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from UpLift", emailTemplate(otp));
        console.log("Email sent Successfully", mailResponse);
    }
    catch (error) {
        console.log("error occured while sending mail", error);
        throw error;
    }
}

//premiddleware for sending mail
OTPSchema.pre("save", async function (next) {//before(pre) saving document in DB run this(send mail) 
    await sendVerificationEmail(this.email, this.otp);
    //now no need to write next(), it automatically does (it was old method)
})

module.exports = mongoose.model("OTP", OTPSchema);