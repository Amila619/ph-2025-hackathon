import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { purchaseProduct, purchaseService, finalizeSaleProduct, finalizeSaleService } from "../controllers/purchase.controller.js";

const router = express.Router();

router.post('/product', authenticate, purchaseProduct);
router.post('/service', authenticate, purchaseService);
router.post('/product/finalize', authenticate, finalizeSaleProduct);
router.post('/service/finalize', authenticate, finalizeSaleService);

export default router;


