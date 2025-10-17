import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/', listProducts);
router.post('/', authenticate, authorize('admin'), createProduct);
router.get('/:id', getProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;


