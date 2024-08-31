import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import checkAuth from "../middlewares/auth.js";
import { userSchema, loginSchema } from "../utils/zodSchemas.js"
import { setUser } from "../utils/jwtfuncs.js"

const router = express.Router();

router.route("/register")
    .post(async (req, res) => {
        try {
            const { username, password, role, task } = userSchema.parse(req.body);
            //checking if user already exist or not 
            const usernameExits = await User.findOne({ username })
            if (usernameExits) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "USER_ALREADY_EXISTS",
                    message: "user already exist"
                });
            }
            const hash = await bcrypt.hash(password, 12)
            const user = new User({
                username,
                password: hash,
                role,
                task
            });
            await user.save();
            return res.status(201).json({
                status: "success",
                message: "User created successfully"
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({
                status: "error",
                errorCode: "INVALID_DATA",
                message: (err.errors?.length > 0 && err.errors[0].message) ? err.errors[0].message : err.message
            });
        }
    });


router.route("/login")
    .post(checkAuth, async (req, res) => {
        try {
            console.log(req.originalUrl);
            let { username, password } = loginSchema.parse(req.body);
            username = username.trim();
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "INVALID_DATA",
                    message: "Password or username is incorrect"
                });
            }
            const validPassword = bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "INVALID_DATA",
                    message: "Password or username is incorrect"
                });
            }
            // making of token if every thing is fine
            const token = setUser({ _id: user._id });
            return res.status(200).json({
                status: "success",
                message: "User logged in successfully",
                data: {
                    token
                }
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({
                status: "error",
                errorCode: "INVALID_DATA",
                message: (err.errors?.length > 0 && err.errors[0].message) ? err.errors[0].message : err.message
            });
        }
    });

export default router;