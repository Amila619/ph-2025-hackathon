import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createService, listServices, getService, updateService, deleteService } from "../controllers/service.controller.js";

const router = express.Router();

router.get('/', listServices);
router.post('/', authenticate, createService);
router.get('/:id', getService);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);

export default router;


