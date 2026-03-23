const mongoose = require("mongoose");
// const { resetPassword } = require("../controllers/ResetPassword");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],//can only be three things, therefore use enum 
        required: true,
    },
    additionalDetails: {//this is profile
        type: mongoose.Schema.Types.ObjectId,
        //In Mongoose, mongoose.Schema.Types.ObjectId is a specific data type used to store a unique identifier for a document. If you think of a SQL database, this is similar to a Foreign Key.
        reqeuired: true,
        ref: "Profile",
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],//array therefore use []
    image: {
        type: String,//url
        required: true,
    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
    }],
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

module.exports = mongoose.model("User", userSchema);//User naam se userSchema model ko export kar diye