import User from "../model/user.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(user);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    res.status(HTTP_STATUS.OK).json(user);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    res.status(HTTP_STATUS.OK).json({ message: "User deleted" });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


