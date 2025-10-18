import WelfareApplication from "../model/welfare-application.model.js";
import User from "../model/user.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const applyWelfare = async (req, res) => {
  try {
    const { documents = [], note } = req.body;
    const userId = req.user?.sub;
    
    console.log('Welfare application request:', { userId, documents, note });
    
    if (!userId) {
      console.error('Welfare application: No user ID found');
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const existing = await WelfareApplication.findOne({ user_id: userId, status: { $in: ['pending', 'approved'] } });
    if (existing) {
      console.log('Welfare application: User already has pending/approved application');
      return res.status(HTTP_STATUS.CONFLICT).json({ message: "You already have a pending or approved welfare application" });
    }

    const app = await WelfareApplication.create({ user_id: userId, documents, note });
    console.log('Welfare application created:', app);
    res.status(HTTP_STATUS.CREATED).json(app);
  } catch (err) {
    console.error('Welfare application error:', err);
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
    
    console.log('Review welfare request:', { id, action, userId: req.user?.sub });
    
    const app = await WelfareApplication.findById(id);
    if (!app) {
      console.error('Welfare application not found:', id);
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Application not found" });
    }

    console.log('Found welfare application:', app);

    if (action === 'approve') {
      app.status = 'approved';
      await app.save();
      console.log('Application approved, updating user welfare status...');
      await User.findByIdAndUpdate(app.user_id, { isWelfareReciever: true });
      console.log('User welfare status updated successfully');
    } else if (action === 'reject') {
      app.status = 'rejected';
      await app.save();
      console.log('Application rejected');
    } else {
      console.error('Invalid action:', action);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid action" });
    }
    
    console.log('Review completed successfully:', app);
    res.status(HTTP_STATUS.OK).json(app);
  } catch (err) {
    console.error('Review welfare error:', err);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


