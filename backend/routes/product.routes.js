import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/', listProducts);
router.post('/', authenticate, createProduct);
router.get('/:id', getProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;


