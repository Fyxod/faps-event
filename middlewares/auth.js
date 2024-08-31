import { getUser } from '../utils/jwtfuncs.js';

export default function checkAuth(req, res, next) {

    // search for token if and only if cookies exist
    const token = req.headers['authorization']; 
    console.log(req.headers);
    console.log(token);
    if (!token) {
        return next();
    }

    const user = getUser(token);
    if (!user) {
        return res.status(401).json({
            status: "error",
            errorCode: "UNAUTHORIZED",
            message: "Unauthorized access",
        });
    }
    req.user = user;
    next();
}