# Habit Tracker - Deployment Guide (Vercel + Render)

## Overview
- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Render (https://render.com)
- **Database**: MongoDB Atlas

---

## STEP 1: Prepare MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
5. Copy this for later (needed for Render)

---

## STEP 2: Deploy Backend to Render

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Go to https://render.com
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Select your GitHub repository
6. Configure:
   - **Name**: `habit-tracker-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

7. Add environment variables:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<create-a-strong-secret-key>
   JWT_EXPIRY=7d
   EMAIL_USER=<your-gmail@gmail.com>
   EMAIL_PASSWORD=<your-app-password>
   NODE_ENV=production
   FRONTEND_URL=<will-update-after-vercel-deployment>
   ```

8. Click "Create Web Service"
9. Wait for deployment to complete
10. Copy the URL (e.g., `https://habit-tracker-api.onrender.com`)

### Option B: Manual Deployment

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Paste your GitHub repo URL
5. Follow the same configuration as above

---

## STEP 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add environment variables:
   ```
   VITE_API_BASE_URL=https://habit-tracker-api.onrender.com/api
   ```
   (Use the Render URL from Step 2)

7. Click "Deploy"
8. Wait for deployment to complete
9. Copy your Vercel URL (e.g., `https://habit-tracker.vercel.app`)

---

## STEP 4: Update Backend CORS

Now update Render with the Vercel frontend URL:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://habit-tracker.vercel.app
   ```
5. Click "Save" (this triggers a redeploy)

---

## STEP 5: Test Your Deployment

1. Open your Vercel frontend URL
2. Try to:
   - Register a new account
   - Login
   - Add a habit
   - View the calendar
   - Check email notifications

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` is correct
- Check Render backend is running (green status)
- Check browser console for CORS errors

### Backend not starting on Render
- Check logs in Render dashboard
- Verify MongoDB URI is correct
- Check all environment variables are set

### Email notifications not working
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" if using regular Gmail

---

## Production Checklist

- [ ] MongoDB URI uses production database
- [ ] JWT_SECRET is strong and unique
- [ ] EMAIL credentials are correct
- [ ] FRONTEND_URL matches your Vercel domain
- [ ] Both services show "Running" status
- [ ] Test login and habit creation
- [ ] Check email notifications

---

## Monitoring

**Render Dashboard**:
- View logs: https://dashboard.render.com → Select service → Logs
- Monitor uptime and resource usage

**Vercel Dashboard**:
- View deployment logs: https://vercel.com → Select project → Deployments
- Check analytics and performance
