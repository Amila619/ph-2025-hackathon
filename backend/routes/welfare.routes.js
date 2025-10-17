import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { applyWelfare, listWelfareApplications, reviewWelfare } from "../controllers/welfare.controller.js";

const router = express.Router();

router.post('/apply', authenticate, applyWelfare);
router.get('/', authenticate, authorize('admin'), listWelfareApplications);
router.post('/:id/review', authenticate, authorize('admin'), reviewWelfare);

export default router;


