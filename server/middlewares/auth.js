const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

// This function is used as middleware to authenticate user requests
// exports.auth = async (req, res, next) => {
//     try {
//         // Extracting JWT from request cookies or body or header
//         const token =
//             req.cookies.token ||
//             req.body.token ||
//             (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

//         // If JWT is missing, return 401 Unauthorized response
//         if (!token) {
//             return res.status(401).json({ success: false, message: `Token Missing` });
//         }
//         if (!token || token === "null" || token === "undefined") {
//             return res.status(401).json({ success: false, message: `Token Missing` });
//         }

//         try {
//             // Verifying the JWT using the secret key stored in environment variables
//             const decode = jwt.verify(token, process.env.JWT_SECRET);
//             console.log(decode);
//             // Storing the decoded JWT payload in the request object for further use
//             req.user = decode;
//         } catch (error) {
//             // If JWT verification fails, return 401 Unauthorized response
//             console.log("JWT VERIFY ERROR:", error.message); // ADD THIS LOG
//             return res
//                 .status(401)
//                 .json({ success: false, message: "token is invalid" });
//         }

//         // If JWT is valid, move on to the next middleware or request handler
//         next();
//     } catch (error) {
//         // If there is an error during the authentication process, return 401 Unauthorized response
//         return res.status(401).json({
//             success: false,
//             message: `Something Went Wrong While Validating the Token`,
//         });
//     }
// };
// server/middleware/auth.js
// server/middleware/auth.js

exports.auth = async (req, res, next) => {
    try {
        // 1. SAFE EXTRACTION: We check if req exists and if req.cookies exists
        // before we ever try to touch '.token'
        const token =
            (req.cookies && req.cookies.token) ||
            (req.body && req.body.token) ||
            (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);

        // DEBUG: Check your server terminal to see if the token is actually arriving
        // console.log("DEBUG: Token found is ->", token ? "Token Received" : "NULL");

        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // 2. VERIFY
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next();
    } catch (error) {
        // This will now catch actual JWT errors, not 'undefined' crashes
        console.error("MIDDLEWARE ERROR:", error.message);
        return res.status(401).json({
            success: false,
            message: "Something Went Wrong While Validating the Token",
        });
    }
};

exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor",
            });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
};