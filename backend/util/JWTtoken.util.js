import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        { ...user},
        process.env.JWT_ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {...user},
        process.env.JWT_REFRESH_TOKEN_SECRET ,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );
};

export const verifyAccessToken = (token) => {
    try {
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
};

export const verifyRefreshToken = (token) => {
    try {
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
};