import { registerUser, loginUser } from "../service/auth.service.js";
import { HTTP_STATUS } from "../const/http-status.const.js";
import { RESPONSE_MESSAGE } from "../const/response.const.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../util/JWTtoken.util.js";
import { Redis_addExpireValue, Redis_addValue, Redis_deleteKey, Redis_getValue } from "../service/redis.service.js";
import 'dotenv/config';
import Crypto from "crypto";
import sendEmail from "../service/email.service.js";
import cookie from "cookie";
import User from "../model/user.model.js";

export const register = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Validate required fields
    if (!email || !name) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: "Email and name are required" 
      });
    }

    const user = await registerUser(email, name);
    
    // Generate OTP for email verification
    const otp = Crypto.randomBytes(4).toString('hex');
    Redis_addExpireValue(`otp:${user._id}`, otp, 300); // OTP valid for 5 minutes

    // Send OTP via email
    sendEmail(user.universityMail, "Verify Your Registration", 
      `Welcome to ResLink! Your verification code is: ${otp}. This code will expire in 5 minutes.`);

    res.status(HTTP_STATUS.CREATED).json({ 
      message: "Registration successful! Please check your email for OTP verification.", 
      user 
    });

  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {

    const { universityMail } = req.body;
    const user = await loginUser(universityMail);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.NO_USER });
    }

    const otp = Crypto.randomBytes(4).toString('hex');
    Redis_addExpireValue(`otp:${user._id}`, otp, 300); // OTP valid for 5 minutes

    sendEmail(user.universityMail, "Your OTP Code", `Your OTP code is: ${otp}`);

    res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.VERIFY_OTP, user: user });

  } catch (err) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {

  const { user, otp } = req.body;

  const storedOtp = await Redis_getValue(`otp:${user._id}`);

  if (storedOtp && storedOtp == otp) {
    // Always fetch from DB to ensure we sign tokens with the correct role
    const dbUser = await User.findById(user._id).lean();
    if (!dbUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.LOGIN_FAILED });
    }

    const accessToken = generateAccessToken(dbUser);
    const refreshToken = generateRefreshToken(dbUser);

    Redis_deleteKey(`otp:${user._id}`);
    Redis_addValue(`refreshToken:${user._id}`, refreshToken, 7 * 24 * 60 * 60); // track valid refresh tokens

    res.setHeader("Set-Cookie", cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_INT)
    }));

    return res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.LOGIN_SUCCESS, user: dbUser, accessToken: accessToken });
  }
  res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.INVALID_OTP });
};

export const refresh = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.refreshToken;
    if (!token) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.LOGIN_FAILED });

    const payload = verifyRefreshToken(token);

    // Optional: check token exists in Redis set for this user
    // If you want strict validation per token instance, store a jti

    // Fetch user to include role in refreshed access token
    const dbUser = await User.findById(payload.sub).lean();
    if (!dbUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.LOGIN_FAILED });
    }

    const user = { _id: dbUser._id, universityMail: dbUser.universityMail, role: dbUser.role };
    const newAccess = generateAccessToken(user);
    return res.status(HTTP_STATUS.OK).json({ accessToken: newAccess });
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.LOGIN_FAILED });
  }
};

export const logout = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.refreshToken;
    if (token) {
      // Best-effort delete cookie; also could remove from Redis if tracking per-user tokens
      res.setHeader("Set-Cookie", cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
      }));
    }
    return res.status(HTTP_STATUS.OK).json({ message: "Logged out" });
  } catch (err) {
    return res.status(HTTP_STATUS.OK).json({ message: "Logged out" });
  }
};