import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import ms from "ms"

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import User from '../models/user.js';
import sendMail from '../sendMail.js';

import { addImage, deleteImage } from '../utils/addImage.js';
dotenv.config();


const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRY || '1d'
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRY || '10d'
const expiresInMs = ms(accessTokenExpire);
const expiresInMsRefresh = ms(refreshTokenExpire);

export const accessTokenOptions = {
    expires: new Date(Date.now() + expiresInMs),
    maxAge: expiresInMs,
    httpOnly: true,
    sameSite: 'lax',
    secure: true
};
export const refreshTokenOptions = {
    expires: new Date(Date.now() + expiresInMsRefresh),
    maxAge: expiresInMsRefresh,
    httpOnly: true,
    sameSite: "lax",
    secure: true
};

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken();


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken, success: true }

    } catch (error) {
        return { accessToken: "", refreshToken: "", success: false }
    }
}

const deleteFileFromLocal = async (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        }
    });
}

export const registrationUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if ([email, password].some((field) => field?.trim() === "")) {
            return res.status(200).json({
                success: false,
                error: "Please fill in all the fields"
            });
        }

        if (password.length < 8) {
            return res.status(200).json({
                success: false,
                error: "Password must be at least 8 characters"
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                success: false,
                error: "This email is already registered with another account"
            })
        }

        const avatar = req.files?.avatar[0] || req.files?.avatar;

        if (!avatar) {
            return res.status(200).json({
                success: false,
                error: "Avatar is required"
            })
        }


        // Define the destination directory where you want to save the uploaded file
        const uploadDirectory = './uploads/';

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        // Move the uploaded file to the upload directory
        let localeFilePath = uploadDirectory + avatar.name
        await avatar.mv(uploadDirectory + avatar.name, function (err) {
            if (err) {
                console.log("Error uploading file:", err);
            }
        });

        const { url, success } = await addImage(localeFilePath)
        if (!success) {
            deleteFileFromLocal(localeFilePath)
            return res.status(200).json({
                success: false,
                error: "Issue setting avatar"
            })
        }

        deleteFileFromLocal(localeFilePath)

        user = ({
            email: email,
            password: password,
            avatar: url
        })

        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;
        const data = { user, activationCode };

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        // console.log(path.join(__dirname, "../mails/activation-mail.ejs"));
        const html = await ejs.renderFile(
            path.join(__dirname, "../mails/activation-mail.ejs"),
            data
        );
        try {
            await sendMail({
                email: user.email,
                subject: "Account Activation Mail",
                template: "activation-mail.ejs",
                data,
            });
            res.status(200).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });
        } catch (error) {
            return res.status(200).json({
                success: false,
                error: "Error sending email",
            });
        }

    } catch (error) {
        console.log("error in signup controller: ", error);
        res.status(500).json({
            error: "Internal Server error",
            success: false,
        });
    }
}

export const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET,
        {
            expiresIn: "5m",
        }
    );
    return { token, activationCode };
};

export const activateUser = async (req, res) => {
    try {
        const { activation_token, activation_code } = req.body;

        const newUser = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET,
        )

        if (newUser.activationCode !== activation_code) {
            return res.status(200).json({
                success: false,
                error: "Incorrect activation code",
            });
        }

        const { email, password, avatar } = newUser.user;

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(200).json({
                error: "This email is already registered with another account",
                success: false,
            });
        }

        await User.create({
            avatar,
            email,
            password,
        });

        req.body = { email, password }

        await loginUser(req, res);
    }
    catch (error) {
        console.log("Error in activateBuyer", error.message);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }

}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(200).json({
                error: "All the credentials are required"
            })
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(200).json({ error: "Invalid credentials", success: false });
        }

        const isPasswordMatch = await user.comparePassword(password.trim());
        if (!isPasswordMatch) {
            return res.status(200).json({ error: "Invalid credentials", success: false });
        }
        const { accessToken, refreshToken, success } = await generateAccessAndRefreshTokens(user._id)

        if (!success) {
            return res.status(200).json({
                success: false,
                error: "Invalid credentials",
            })
        }

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        return res.status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged In Successfully",
                success: true,
            })

    } catch (error) {
        console.log("Error in loginBuyer", error.message);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }
}

export const socialAuth = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email });
        }

        const { accessToken, refreshToken, success } = await generateAccessAndRefreshTokens(user._id)
        if (!success) {
            return res.status(200).json({
                success: false,
                error: "Invalid credentials",
            })
        }

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        return res.status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged In Successfully",
                success: true,
            })

    } catch (error) {
        return res.status(200).json({
            success: false,
            error: error.message,
        })
    }
};

export const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )


        res.cookie("accessToken", "", {
            maxAge: 1,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });
        res.cookie("refreshToken", "", {
            maxAge: 1,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });
        return res.status(200).json({
            success: true,
            message: "Successfully logged out",
        })

    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUser = async (req, res) => {
    try {
        const { user } = req;

        res.status(200).json({
            user,
            success: true,
        })

    } catch (error) {
        console.log("Error in getBuyer controller: " + error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        })
    }
}

export const makePrediction = async (req, res) => {
    try {
        // Ensure image file exists in request
        const image = req.files?.image[0] || req.files?.image;
        if (!image) {
            return res.status(400).json({ success: "false", error: 'No image provided' });
        }

        // Save the image file temporarily
        const uploadDirectory = './uploads/';

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        // Move the uploaded file to the upload directory
        let localeFilePath = uploadDirectory + image.name
        await image.mv(uploadDirectory + image.name, function (err) {
            if (err) {
                console.log("Error uploading file:", err);
            }
        });

        const { public_id, url, success } = await addImage(localeFilePath)
        if (!success) {
            deleteFileFromLocal(localeFilePath)
            return res.status(200).json({
                success: false,
                error: "Some Error Occurred. Please Try Again"
            })
        }

        // Call Python script for prediction
        const pythonProcess = spawn('python',
            ['./controllers/main.py', url]);

        let responseData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            responseData = data.toString();
            // console.log(responseData)
        });

        // Handle any errors from the Python script
        pythonProcess.stderr.on('data', (data) => {
            errorData = data.toString();
        });
        // console.log("here")

        // After both stdout and stderr events have occurred
        pythonProcess.on('close', async (code) => {
            if (code === 0) {
                try {
                    // console.log("here1", responseData)
                    const predictions = JSON.parse(responseData);
                    await deleteImage(public_id)
                    res.status(200).json(predictions);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.status(500).json({ success: false, error: 'An error occurred while processing the request.' });
                }
            } else {
                console.error(`Python script process exited with code ${code}`);
                console.error('Error from Python script:', errorData);
                await deleteImage(public_id)
                res.status(500).json({ success: false, error: 'An error occurred while processing the request.' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: 'An error occurred while processing the request.' });
    }
};
