# 📝 Habit Tracker

A modern full-stack web application for building and tracking daily habits with email reminders, calendar views, and real-time progress tracking.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Habit Management**: Create, edit, delete habits with categories and priorities
- **Calendar Views**: 
  - Month calendar view with habit indicators
  - Week calendar view with daily breakdown
  - List view with filtering and sorting
- **Email Notifications**: Automatic reminders for overdue habits (Nodemailer + Gmail)
- **Statistics Dashboard**: Track completion rates, streaks, and progress
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS for beautiful, accessible design

## 🚀 Live Demo

- **Frontend**: [https://habit-tracker-demo.vercel.app](https://habit-tracker-demo.vercel.app)
- **Backend API**: [https://habit-tracker-api.onrender.com](https://habit-tracker-api.onrender.com)

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Calendar for calendar views
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Nodemailer for email notifications
- Node-cron for scheduled tasks
- Helmet for security headers

### Database
- MongoDB Atlas (Cloud)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker
PORT=5000
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Run Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 in your browser.

## 📧 Email Setup

To enable email notifications:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password and add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

## 🚀 Deployment

### Deploy to Render (Backend)

1. Push code to GitHub
2. Go to https://render.com and sign up
3. Create new Web Service
4. Connect GitHub repository
5. Use settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add environment variables from `.env`
6. Deploy!

### Deploy to Vercel (Frontend)

1. Go to https://vercel.com and sign up
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_BASE_URL`: Your Render backend URL
5. Deploy!

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Notifications
- `GET /api/notifications` - Get notification settings
- `PUT /api/notifications` - Update settings
- `POST /api/notifications/test-email` - Send test email

## 📝 Usage

1. **Register**: Create a new account
2. **Add Habits**: Create habits with categories and priorities
3. **Track**: Mark habits as completed daily
4. **Monitor**: View progress in calendar and list views
5. **Receive Reminders**: Get email notifications for overdue habits

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens for secure authentication
- Environment variables for sensitive data
- Helmet for security headers
- CORS properly configured
- Input validation with Joi

## 🐛 Known Issues

- Email notifications require Gmail account (can be extended to other providers)
- Free tier limitations on Render (may experience cold starts)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Created with ❤️ for better habit tracking

---

**Happy Habit Tracking! 🎯**
