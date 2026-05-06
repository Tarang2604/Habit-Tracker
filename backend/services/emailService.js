const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailTemplates = {
  overdueHabits: (userName, habits) => ({
    subject: `📋 Habit Reminder: You have ${habits.length} overdue habit(s)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4338ca;">Habit Reminder</h2>
        <p>Hi ${userName},</p>
        <p>You have <strong>${habits.length}</strong> overdue habit(s) that need your attention:</p>
        <ul style="background: #f3f4f6; padding: 15px; border-radius: 8px; list-style: none;">
          ${habits
            .map(
              (habit) => `
            <li style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
              <strong>${habit.title}</strong>
              <br />
              <small>Due: ${new Date(habit.dueDate).toLocaleDateString()}</small>
              <br />
              <small style="color: #666;">Category: ${habit.category || 'General'}</small>
            </li>
          `
            )
            .join('')}
        </ul>
        <p style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background: #4338ca; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Mark Habits Complete
          </a>
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This is an automated reminder from Habit Tracker. You can manage notification preferences in your account settings.
        </p>
      </div>
    `
  }),

  testEmail: (userName) => ({
    subject: '✅ Habit Tracker Test Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4338ca;">🎉 Test Email Successful!</h2>
        <p>Hi ${userName},</p>
        <p>This is a test email to confirm that notifications are working correctly on your Habit Tracker account.</p>
        <p>If you receive this email, your notification settings are configured properly!</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Habit Tracker Team
        </p>
      </div>
    `
  })
};

const sendEmail = async (to, template, data) => {
  try {
    const emailContent = template(data.userName, data.habits || []);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      ...emailContent
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};
