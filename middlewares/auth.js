import { getUser } from '../utils/jwtfun.js';

export  function checkAuth(req, res, next) {

    // search for token if and only if cookies exist
    const token = req.cookies?.token; 
    if (!token) {
        req.user = null;
        return next();
    }

    const user = getUser(token);
    if (!user) {
        res.clearCookie('token');
    }
    req.user = user;
    return next();
} 
