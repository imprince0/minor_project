import jwt from 'jsonwebtoken';
import User from '../models/user.js'
import { refreshingTokens } from './refreshTokenHelper.js';

const isAuthenticated = async (req, res, next) => {
    const access_token = req.cookies.accessToken;
    const refresh_token = req.cookies.refreshToken;

    if (!access_token) {
        if (!refresh_token) {
            return res.status(200).json({
                error: "First login to proceed",
                success: false,
            });
        } else {
            return refreshingTokens(req, res, next);
        }
    }

    try {
        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            if(!refresh_token){
                return res.status(200).json({
                    error: "JWT token is not valid",
                    success: false,
                });
            }else{
                return refreshingTokens(req, res, next);
            }
        }

        // Check if the access token is expired
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            if(!refresh_token){
                return res.status(200).json({
                    error: "JWT token has expired",
                    success: false
                });
            }else{
                return refreshingTokens(req, res, next);
            }
        } else {
            const user = await User.findById(decoded._id).select("-password -refreshToken");

            if (!user) {
                if(!refresh_token){
                    return res.status(200).json({
                        error: "First login to proceed",
                        success: false,
                    });
                }else{
                    return refreshingTokens(req, res, next);
                }
            }

            req.user = user;
            next();
        }
    } catch (error) {
        console.log("Error in IsAuthenticated User", error)
        return res.status(500).json({
            error: "Internal Server Error",
            success: false,
        });
    }
};

export default isAuthenticated