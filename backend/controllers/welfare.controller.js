import WelfareApplication from "../model/welfare-application.model.js";
import User from "../model/user.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const applyWelfare = async (req, res) => {
  try {
    const { documents = [], note } = req.body;
    const userId = req.user?.sub;
    if (!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });

    const existing = await WelfareApplication.findOne({ user_id: userId, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(HTTP_STATUS.CONFLICT).json({ message: "Existing application pending or already approved" });

    const app = await WelfareApplication.create({ user_id: userId, documents, note });
    res.status(HTTP_STATUS.CREATED).json(app);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const listWelfareApplications = async (_req, res) => {
  try {
    const apps = await WelfareApplication.find().populate('user_id');
    res.status(HTTP_STATUS.OK).json(apps);
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const reviewWelfare = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' | 'reject'
    const app = await WelfareApplication.findById(id);
    if (!app) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Application not found" });

    if (action === 'approve') {
      app.status = 'approved';
      await app.save();
      await User.findByIdAndUpdate(app.user_id, { isWelfareReciever: true });
    } else if (action === 'reject') {
      app.status = 'rejected';
      await app.save();
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid action" });
    }
    res.status(HTTP_STATUS.OK).json(app);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


