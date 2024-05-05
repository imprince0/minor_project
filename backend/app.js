import express from "express";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

import userRouter from "./routes/user.route.js";

export const app = express();
dotenv.config()

// body parser
app.use(fileUpload())
app.use(express.json({ limit: "50mb" })); //for cloudinery
// cookie parser
app.use(cookieParser());

// cors == cross origin resource sharing
// if not used ==> one can hit the api from any other url
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/v1/", userRouter);

// testing api
app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: "true",
        message: "Api is working",
    });
});

app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} Not Found`);
    err.statusCode = 404;
    next(err);
});
