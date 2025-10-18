import Product from "../model/product.model.js";
import Service from "../model/service.model.js";
import Donation from "../model/donation.model.js";
import User from "../model/user.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

const applyDonationSubsidy = async (amount) => {
  // Use available donations to cover up to 10% of amount
  let remainingSubsidy = Math.min(amount * 0.10, amount);
  let consumed = 0;
  const donations = await Donation.find({ donated_amount: { $gt: 0 } }).sort({ createdAt: 1 });
  for (const d of donations) {
    const available = Math.max(0, d.donated_amount - (d.consumed_amount || 0));
    if (available <= 0) continue;
    const use = Math.min(available, remainingSubsidy);
    d.consumed_amount = (d.consumed_amount || 0) + use;
    await d.save();
    consumed += use;
    remainingSubsidy -= use;
    if (remainingSubsidy <= 0) break;
  }
  return consumed;
};

export const purchaseProduct = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });

    const user = await User.findById(userId);

    let subsidy = 0;
    if (user?.isWelfareReciever) {
      subsidy = await applyDonationSubsidy(product.price);
    }
    const payByUser = Math.max(0, product.price - subsidy);

    await User.findByIdAndUpdate(userId, { $addToSet: { purchased_products: product._id?.toString?.() || product.id } });

    res.status(HTTP_STATUS.OK).json({
      productId,
      price: product.price,
      subsidy,
      payByUser
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const purchaseService = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Service not found" });

    // Assume service has a price-like field; if not, treat price as 0
    const price = Number(service?.price || 0);
    const user = await User.findById(userId);

    let subsidy = 0;
    if (user?.isWelfareReciever) {
      subsidy = await applyDonationSubsidy(price);
    }
    const payByUser = Math.max(0, price - subsidy);

    await User.findByIdAndUpdate(userId, { $addToSet: { purchased_services: service._id?.toString?.() || service.id } });

    res.status(HTTP_STATUS.OK).json({
      serviceId,
      price,
      subsidy,
      payByUser
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

const applyDonationBonus = async (amount) => {
  // Seller bonus from donations: 10% of amount if available
  return applyDonationSubsidy(amount);
};

export const finalizeSaleProduct = async (req, res) => {
  try {
    const userId = req.user?.sub; // seller
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });

    const seller = await User.findById(userId);
    let bonus = 0;
    if (seller?.isWelfareReciever) {
      bonus = await applyDonationBonus(product.price);
    }
    const payoutToSeller = product.price + bonus;

    res.status(HTTP_STATUS.OK).json({
      productId,
      basePrice: product.price,
      bonus,
      payoutToSeller
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const finalizeSaleService = async (req, res) => {
  try {
    const userId = req.user?.sub; // seller
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Service not found" });
    const price = Number(service?.price || 0);

    const seller = await User.findById(userId);
    let bonus = 0;
    if (seller?.isWelfareReciever) {
      bonus = await applyDonationBonus(price);
    }
    const payoutToSeller = price + bonus;

    res.status(HTTP_STATUS.OK).json({
      serviceId,
      basePrice: price,
      bonus,
      payoutToSeller
    });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


