import Donation from "../model/donation.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const createDonation = async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const { donated_amount } = req.body;
    
    if (!donated_amount || donated_amount <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid donation amount" });
    }

    console.log('Creating donation:', { userId, donated_amount });

    const donation = await Donation.create({
      d_uid: userId,
      donated_amount: donated_amount,
      consumed_amount: 0,
      donatedAt: new Date()
    });

    console.log('Donation created successfully:', donation);
    res.status(HTTP_STATUS.CREATED).json(donation);
  } catch (err) {
    console.error('Error creating donation:', err);
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


