import { registerUser, loginUser } from "../service/auth.service.js";
import { HTTP_STATUS } from "../const/http-status.const.js";
import { RESPONSE_MESSAGE } from "../const/response.const.js";
import { generateAccessToken, generateRefreshToken } from "../util/JWTtoken.util.js";
import { Redis_addExpireValue, Redis_addValue, Redis_deleteKey, Redis_getAllValues, Redis_getValue, Redis_removeValue } from "../service/redis.service.js";
import 'dotenv/config';
import Crypto from "crypto";
import sendEmail from "../service/email.service.js";

export const register = async (req, res) => {
  try {

    // const { email } = req.body;
    // const user = await registerUser(email);

    // res.status(HTTP_STATUS.CREATED).json({ message: RESPONSE_MESSAGE.USER_CREATED_SUCCESS, user });

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    Redis_deleteKey(`otp:${user._id}`);
    Redis_addValue(`refreshToken:${user._id}`, refreshToken, 7 * 24 * 60 * 60); // Refresh token valid for 7 days

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_INT), // 7 days
    });

    return res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.LOGIN_SUCCESS, user: user, accessToken: accessToken });
  }
  res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.INVALID_OTP });
};