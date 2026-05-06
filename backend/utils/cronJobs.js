const cron = require('node-cron');
const Habit = require('../models/Habit');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../services/emailService');

const startCronJobs = () => {
  // Run daily at 8:00 AM to check for overdue habits
  cron.schedule('0 8 * * *', async () => {
    console.log('Running overdue habits notification job...');
    try {
      const users = await User.find({ emailNotifications: true });

      for (const user of users) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const overdueHabits = await Habit.find({
          userId: user._id,
          completed: false,
          dueDate: { $lt: now },
          notified: false
        });

        if (overdueHabits.length > 0) {
          const emailSent = await sendEmail(user.email, emailTemplates.overdueHabits, {
            userName: user.name,
            habits: overdueHabits
          });

          if (emailSent) {
            await Habit.updateMany(
              { _id: { $in: overdueHabits.map((h) => h._id) } },
              { notified: true }
            );
          }
        }
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });

  console.log('Cron jobs started');
};

module.exports = { startCronJobs };
