import Donation from "../model/donation.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(donation);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const listDonations = async (_req, res) => {
  try {
    const donations = await Donation.find();
    res.status(HTTP_STATUS.OK).json(donations);
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Donation not found" });
    res.status(HTTP_STATUS.OK).json(donation);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donation) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Donation not found" });
    res.status(HTTP_STATUS.OK).json(donation);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Donation not found" });
    res.status(HTTP_STATUS.OK).json({ message: "Donation deleted" });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


