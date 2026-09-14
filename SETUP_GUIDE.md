# 🚀 BUSHORT - Complete Setup Guide

## **Prerequisites**

Before you start, install these:

1. **Node.js 18+** → https://nodejs.org/
2. **Git** → https://git-scm.com/
3. **Expo CLI** → https://docs.expo.dev/
4. **Neon PostgreSQL** → https://console.neon.tech/ (free account)

---

## **Step 1: Clone the Repository**

```bash
git clone https://github.com/fatimashazaliy-crypto/Bushort.git
cd Bushort
```

---

## **Step 2: Setup Backend**

### **2.1 Install Dependencies**
```bash
cd backend
npm install
```

### **2.2 Create Environment File**
```bash
cp .env.example .env
```

Or create `.env` manually with:
```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRY=7d

# Refresh Token
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this
JWT_REFRESH_EXPIRY=30d

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:19000,exp://localhost:19000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **2.3 Get PostgreSQL Database URL**

1. Go to https://console.neon.tech/
2. Sign up (free)
3. Create new project
4. Copy connection string: `postgresql://user:password@...`
5. Paste in `.env` as `DATABASE_URL`

### **2.4 Run Database Migrations**
```bash
npm run migrate
```

### **2.5 Start Backend Server**
```bash
npm run dev
```

**Expected output:**
```
🚀 BUSHORT API running on http://localhost:3000
📊 WebSocket ready for real-time features
📝 Database connected to Neon PostgreSQL
```

✅ **Backend is now running!**

---

## **Step 3: Setup Mobile App**

### **3.1 Install Dependencies**
```bash
cd ../mobile
npm install
```

### **3.2 Start Expo Development Server**
```bash
npm start
```

**You should see:**
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
› Metro waiting on exp://localhost:19000
› Scan QR code below with Expo Go
```

---

## **Step 4: View App on Your Device**

### **Option A: iPhone Simulator**
```bash
Press: i
```
(Requires macOS with Xcode)

### **Option B: Android Emulator**
```bash
Press: a
```
(Requires Android Studio)

### **Option C: Real Phone (Best!)**

**iPhone:**
1. Download **Expo Go** from App Store
2. Open Expo Go app
3. Scan the QR code from terminal
4. App opens instantly!

**Android:**
1. Download **Expo Go** from Google Play
2. Open Expo Go app
3. Scan the QR code from terminal
4. App opens instantly!

---

## **Step 5: Test the App**

### **Login/Signup**
1. Open app
2. Click "Sign Up"
3. Enter:
   - Email: `test@example.com`
   - Username: `testuser123`
   - Password: `password123`
4. Click "Sign Up"

### **Upload Video**
1. Go to "Create" tab
2. Click "Upload Video"
3. Pick a video from phone
4. Add caption
5. Click "Upload"

### **Send Message**
1. Go to "Chats" tab
2. Click "+"
3. Send message in real-time!

---

## **Troubleshooting**

### **"Cannot connect to API"**
```bash
# Check backend is running
lsof -ti:3000

# If not, restart:
cd backend && npm run dev
```

### **"Database connection failed"**
- Verify `DATABASE_URL` in `.env`
- Check Neon dashboard for active connections
- Make sure your IP is whitelisted

### **"QR code won't scan"**
- Make sure phone is on same WiFi as computer
- Restart Expo: `Ctrl+C` then `npm start` again

### **"Port 3000 in use"**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### **"npm install fails"**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## **Production Deployment**

### **Deploy Backend**

**Option 1: Render.com (Easiest)**
1. Go to https://render.com
2. Connect GitHub repo
3. Add environment variables
4. Deploy

**Option 2: Railway.app**
1. Go to https://railway.app
2. New project → GitHub
3. Select repo
4. Deploy

**Option 3: Heroku**
```bash
heroku create bushort-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### **Deploy Mobile App**

**Build APK (Android)**
```bash
cd mobile
eas build --platform android
# Get APK link
# Install on phone or upload to Google Play
```

**Build IPA (iOS)**
```bash
eas build --platform ios
# Get IPA link
# Upload to App Store or TestFlight
```

---

## **API Documentation**

See all endpoints at: `README.md`

### **Quick Test Endpoints**

```bash
# Test backend is running
curl http://localhost:3000/health

# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "display_name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## **Support**

- 📖 React Native Docs: https://reactnative.dev/
- 📱 Expo Docs: https://docs.expo.dev/
- 🔌 Socket.io Docs: https://socket.io/docs/
- 🐘 PostgreSQL Docs: https://www.postgresql.org/docs/

---

## **Next Steps**

1. ✅ Get app running locally
2. ⬜ Add AWS S3 for video storage
3. ⬜ Deploy backend to Render/Railway
4. ⬜ Update API URL in mobile app
5. ⬜ Build and deploy to App Store/Play Store
6. ⬜ Market your app! 🚀

---

**Ready to launch BUSHORT?** 🎬✨

Good luck! Feel free to ask questions! 💪
