import { accessTokenOptions, generateAccessAndRefreshTokens, refreshTokenOptions } from '../controllers/user.controller.js';
import User from "../models/user.js"
import jwt from 'jsonwebtoken';


export const refreshingTokens = async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refreshToken;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
        if (!decoded) {
            return res.status(200).json({
                error: "JWT token is not valid",
                success: false,
            });
        }

        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            return res.status(200).json({
                error: "JWT token has expired",
                success: false
            });
        } else {
            let user = await User.findById(decoded._id).select("-password");
            
            if (!user) {
                return res.status(200).json({
                    error: "First login to proceed",
                    success: false,
                });
            }
            
            if (refresh_token !== user?.refreshToken) {
                return res.status(200).json({
                    success: false,
                    error: "Invalid Refresh token"
                })
            }

            
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

            if (accessToken && refreshToken) {
                res.cookie("accessToken", accessToken, accessTokenOptions)
                res.cookie("refreshToken", refreshToken, refreshTokenOptions)
            } else {
                return res.status(200).json({
                    success: false,
                    error: "Tokens cant be refreshed at this moment"
                })
            }

            
            user = await user.findById(decoded._id).select("-password -refreshToken");
            req.user = user
            next()
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        })
    }
}