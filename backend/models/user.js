import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new Schema({

    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        index: true,
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
    },

    avatar : {
        type: String,
        required: [true, "Image is required"]
    },

    refreshToken: {
        type: String,
    },

}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Compare password method
UserSchema.methods.comparePassword =  function (password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
} 

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
} 

export default mongoose.models.User || mongoose.model('User', UserSchema);