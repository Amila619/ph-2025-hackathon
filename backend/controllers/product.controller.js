import Product from "../model/product.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(product);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const listProducts = async (_req, res) => {
  try {
    const products = await Product.find();
    res.status(HTTP_STATUS.OK).json(products);
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });
    res.status(HTTP_STATUS.OK).json(product);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });
    res.status(HTTP_STATUS.OK).json(product);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });
    res.status(HTTP_STATUS.OK).json({ message: "Product deleted" });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


