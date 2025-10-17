import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createUser, listUsers, getUser, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// Admin-only for listing all users
router.get('/', authenticate, authorize('admin'), listUsers);
router.post('/', authenticate, authorize('admin'), createUser);
router.get('/:id', authenticate, authorize('admin'), getUser);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;


