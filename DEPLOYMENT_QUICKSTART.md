# 🚀 Quick Deployment Reference

## URLs After Deployment
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-app.onrender.com

## Environment Variables Needed

### Backend (Render)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<unique-strong-key>
JWT_EXPIRY=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<gmail-app-password>
FRONTEND_URL=<vercel-url>
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-app.onrender.com/api
```

## Quick Checklist

- [ ] **MongoDB Atlas**
  - [ ] Create cluster
  - [ ] Get connection string
  - [ ] Whitelist IP (0.0.0.0/0 for testing)

- [ ] **Render Deployment**
  - [ ] Connect GitHub
  - [ ] Add render.yaml
  - [ ] Set environment variables
  - [ ] Copy backend URL

- [ ] **Vercel Deployment**
  - [ ] Import from GitHub
  - [ ] Set VITE_API_BASE_URL
  - [ ] Deploy
  - [ ] Copy frontend URL

- [ ] **Final Setup**
  - [ ] Update FRONTEND_URL in Render
  - [ ] Test login
  - [ ] Test habit creation
  - [ ] Test email notifications

## Key Files
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `render.yaml` - Backend configuration
- `frontend/vercel.json` - Frontend configuration
- `.env.example` - Environment template

## Important Notes
- Render free tier: auto-spins down after 15 min inactivity
- Use MongoDB Atlas free tier (512MB)
- Keep JWT_SECRET secret and unique
- Gmail requires app-specific password (not regular password)
