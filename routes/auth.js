import express, { Route } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { checkAuth } from "../middlewares/auth.js";
import { userSchema, loginSchema } from "../utils/zodSchemas.js"
import { setUser } from "../utils/jwtfun.js"

const router = express.Router();

router.route("/register")
    .post(async (req, res) => {
        try {
            const { username, password, role, task } = userSchema.parse(req.body);
            //checking if user already exist or not 
            const usernameExits = await User.findOne({ username })
            if (usernameExits) {
                return res.status(400).json({
                    message: "This user already exits"
                })
            }
            const hash = bcrypt.hash(password, 12)
            const user = new User({
                username,
                password: hash,
                role,
                task
            });
            await user.save();
            return res.status(200).json({
                message: "user created successfully"
            })
        }
        catch (err) {
            console.log(err);
            res.json(err);
        }
    });


router.route("/login")
    .post(checkAuth, async (req, res) => {
        try {
            if (req.user) {
                return res.json({
                    message: "User already loged in"
                })
            }
            const { username, password } = loginSchema.parse(req.body);
            const user = await User.findOne(username);
            if (!user) {
                return res.status(400).json({
                    message: "Password or username is incorrect"
                });
            }
            const validPassword = bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    message: "Password or username is incorrect"
                });
            }
            // making of token if every thing is fine
            const token = setUser({ _id: user._id });
            return res.json({
                message: 'Login successful',
                token
            });
        }
        catch (err) {
            res.status(400).json({
                message: "incorrect credentials"
            });
        }
    });
