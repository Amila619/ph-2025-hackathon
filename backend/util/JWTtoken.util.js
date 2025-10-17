import jwt from "jsonwebtoken";

const toJwtPayload = (user) => ({
    sub: user._id?.toString?.() || user.id || user.sub,
    email: user.universityMail || user.email
});

export const generateAccessToken = (user) => {
    return jwt.sign(
        toJwtPayload(user),
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        toJwtPayload(user),
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );
};

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
export const decodeToken = (token) => jwt.decode(token);