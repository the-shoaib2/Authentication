import User from '../../Authentication/Models/UserModel.js';

export const checkAccountExpiry = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const expiryDate = new Date(user.accountExpiryDate);
    const timeDiff = expiryDate.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff <= 0) {
      return res.status(403).json({ message: 'Account has expired. Please renew your subscription.' });
    } else if (minutesDiff <= 5) {
      res.locals.expiryWarning = true;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
    checkAccountExpiry
};
