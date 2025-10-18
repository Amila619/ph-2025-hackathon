import Cart from "../model/cart.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) cart = await Cart.create({ user_id: userId, items: [] });
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { kind, refId, qty = 1 } = req.body;
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) cart = await Cart.create({ user_id: userId, items: [] });
    const idx = cart.items.findIndex(i => i.kind === kind && i.refId === refId);
    if (idx >= 0) {
      cart.items[idx].qty += qty;
    } else {
      cart.items.push({ kind, refId, qty });
    }
    await cart.save();
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { kind, refId, qty } = req.body;
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Cart not found" });
    const idx = cart.items.findIndex(i => i.kind === kind && i.refId === refId);
    if (idx < 0) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Item not found" });
    if (qty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].qty = qty;
    }
    await cart.save();
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) cart = await Cart.create({ user_id: userId, items: [] });
    cart.items = [];
    await cart.save();
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


