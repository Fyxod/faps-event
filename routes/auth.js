import express, { Route } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { checkAuth } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register")
    .post(checkAuth,)