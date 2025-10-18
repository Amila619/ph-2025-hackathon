import userModel from "../model/user.model.js";
import { RESPONSE_MESSAGE } from "../const/response.const.js";

export const registerUser = async (universityMail) => {
  try {
    const normalizedEmail = (universityMail || "").trim().toLowerCase();
    const existingUser = await userModel.findOne({ universityMail: normalizedEmail });
    if (existingUser) throw new Error(RESPONSE_MESSAGE.USER_ALREADY_EXISTS);

    const newUser = new userModel({ universityMail: normalizedEmail });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (universityMail) => {
  try {
    const normalizedEmail = (universityMail || "").trim().toLowerCase();
    const user = await userModel.findOne({ universityMail: normalizedEmail });
    if (!user) throw new Error(RESPONSE_MESSAGE.USER_NOT_FOUND);
    return user;
  } catch (error) {
    throw error;
  }
};
