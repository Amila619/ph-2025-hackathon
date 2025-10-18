import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createDonation, listDonations, getDonation, updateDonation, deleteDonation } from "../controllers/donation.controller.js";

const router = express.Router();

// Donations listing could be public or admin-only; making it admin-only for management
router.get('/', authenticate, authorize('admin'), listDonations);
router.post('/', authenticate, createDonation); // any authenticated user can donate
router.get('/:id', authenticate, authorize('admin'), getDonation);
router.put('/:id', authenticate, authorize('admin'), updateDonation);
router.delete('/:id', authenticate, authorize('admin'), deleteDonation);

export default router;


