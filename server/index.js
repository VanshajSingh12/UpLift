const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
//     cors({
//         // origin: "http://localhost:3000",//3000 is frontend
//         origin: ["https://up-lift-h5z6eu4cs-vanshajsingh12s-projects.vercel.app", "http://localhost:3000"],
//         credentials: true,
//     })
// )
app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:3000",
                "https://up-lift-2fq9w58gs-vanshajsingh12s-projects.vercel.app"
            ];
            // Allow if the origin is in our list OR if it's a Vercel preview URL
            if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

//default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
}) 