const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { sendEmail, emailTemplates } = require('../services/emailService');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      emailNotifications: user.emailNotifications || false,
      notificationTime: user.notificationTime || '08:00'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notification settings', error: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { emailNotifications, notificationTime } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { emailNotifications, notificationTime },
      { new: true }
    );
    res.json({ message: 'Notification settings updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
});

router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const emailSent = await sendEmail(user.email, emailTemplates.testEmail, {
      userName: user.name
    });

    if (emailSent) {
      res.json({ message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send test email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending test email', error: error.message });
  }
});

module.exports = router;
