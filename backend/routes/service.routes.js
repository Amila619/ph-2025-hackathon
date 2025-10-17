import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createService, listServices, getService, updateService, deleteService } from "../controllers/service.controller.js";

const router = express.Router();

router.get('/', listServices);
router.post('/', authenticate, authorize('admin'), createService);
router.get('/:id', getService);
router.put('/:id', authenticate, authorize('admin'), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

export default router;


