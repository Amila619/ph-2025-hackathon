import jwt from "jsonwebtoken";

// Fallback secrets for development
const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "dev-access-secret-key-change-in-production";
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "dev-refresh-secret-key-change-in-production";
const ACCESS_EXPIRES = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d";

const toJwtPayload = (user) => ({
    sub: user._id?.toString?.() || user.id || user.sub,
    email: user.universityMail || user.email,
    role: user.role || "user"
});

export const generateAccessToken = (user) => {
    return jwt.sign(
        toJwtPayload(user),
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        toJwtPayload(user),
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES }
    );
};

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
export const decodeToken = (token) => jwt.decode(token);