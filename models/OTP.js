const mongoose = require("mongoose");

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
        default: Date.now(),
        expires: 5 * 60,//expires automatically in 5 minutes
    },
});

//function to send mails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
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
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);