import { getUser } from '../utils/jwtfuncs.js';
import User from '../models/user.js';

export default async function checkAuth(req, res, next) {
    console.log(req.originalUrl);
    // search for token if and only if cookies exist
    const token = req.headers['authorization']; 
    console.log("token", token);
    if (!token && req.originalUrl == '/login') {
        return next();
    }

    const payload = getUser(token);
    if (!payload) {
        return res.status(401).json({
            status: "error",
            errorCode: "UNAUTHORIZED",
            message: "Unauthorized access",
        });
    }
    const user = await User.findById(payload._id);
    if(!user){
        return res.status(401).json({
            status: "error",
            errorCode: "UNAUTHORIZED",
            message: "Unauthorized access",
        });
    }
    req.user = user;
    console.log(req.user)
    next();
}