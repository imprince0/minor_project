import express from "express";
import { registrationUser,activateUser, loginUser,logoutUser, socialAuth, getUser, makePrediction } from "../controllers/user.controller.js";
import isAutheticated from "../middleware/auth.js";
const userRouter=express.Router();

userRouter.post('/registration',registrationUser);
userRouter.post('/activate',activateUser);

userRouter.post('/login',loginUser);
userRouter.get('/logout',isAutheticated,logoutUser);

userRouter.post('/socialAuth',socialAuth);

userRouter.get('/getUser',isAutheticated, getUser);
userRouter.post('/prediction',isAutheticated, makePrediction);

export default userRouter;