import bcrypt from "bcrypt";
import userModel from "../model/user.model.js";
import { RESPONSE_MESSAGE } from "../const/response.const.js";

export const registerUser = async (universityMail, password) => {

  const existingUser = await userModel.findOne({ universityMail });
  if (existingUser) throw new Error(RESPONSE_MESSAGE.USER_ALREADY_EXISTS);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({ universityMail, password: hashedPassword });
  await newUser.save();

  // return newUser as User;
};

export const loginUser = async (universityMail) => {

  // const newUser = new userModel({ universityMail });
  // await newUser.save();

  const user = await userModel.findOne({ universityMail });
  if (!user) throw new Error(RESPONSE_MESSAGE.USER_NOT_FOUND);

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) throw new Error(RESPONSE_MESSAGE.LOGIN_FAILED);

  return user;
};
