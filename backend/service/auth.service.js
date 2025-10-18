import userModel from "../model/user.model.js";
import { RESPONSE_MESSAGE } from "../const/response.const.js";

export const registerUser = async (email, name) => {
  try {
    const normalizedEmail = (email || "").trim().toLowerCase();
    
    // Check if user already exists by email or universityMail
    const existingUser = await userModel.findOne({ 
      $or: [
        { universityMail: normalizedEmail },
        { "contact.email": normalizedEmail }
      ]
    });
    
    if (existingUser) throw new Error(RESPONSE_MESSAGE.USER_ALREADY_EXISTS);

    // Create new user with email and name (no password needed - OTP based auth)
    const newUser = new userModel({ 
      universityMail: normalizedEmail,
      contact: {
        email: normalizedEmail
      },
      name: {
        fname: name.split(' ')[0] || name,
        lname: name.split(' ').slice(1).join(' ') || ''
      }
    });
    
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
