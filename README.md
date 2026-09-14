# BUSHORT - Complete Social Media App

🎬 **Premium Short-Form Video Social Platform**

A fully functional, production-ready social media application built with:
- **Backend**: Node.js + Express + PostgreSQL (Neon)
- **Mobile**: React Native + Expo
- **Real-time**: Socket.io WebSocket
- **Authentication**: JWT tokens

---

## 🚀 Features

✅ **User Authentication**
- Sign up with email & username
- JWT-based login/logout
- Secure password hashing (bcryptjs)
- Token refresh mechanism

✅ **Video Features**
- Upload & share videos
- Vertical feed (TikTok-style)
- Like & unlike videos
- Text & voice comments
- Video visibility settings (public/private/friends)

✅ **Social Features**
- Follow/unfollow users
- User profiles & statistics
- Follower/following lists
- User verification system

✅ **Real-time Messaging**
- Text messages
- Voice messages
- Conversations
- Typing indicators
- Message deletion

✅ **Notifications**
- Likes, comments, follows
- New messages alerts
- Read/unread status

✅ **Mobile App Screens**
- 🏠 **Home** - Infinite video feed
- 💬 **Chats** - Real-time messaging
- ➕ **Create** - Upload videos
- 👤 **Profile** - User profile & statistics

---

## 📦 Project Structure

```
Bushort/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   ├── migrations.ts
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── videos.ts
│   │   │   ├── comments.ts
│   │   │   ├── messages.ts
│   │   │   └── notifications.ts
│   │   ├── socket/
│   │   │   └── socket.ts
│   │   └── index.ts (Main server)
│   ├── package.json
│   └── tsconfig.json
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── AuthScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ChatsScreen.tsx
│   │   │   ├── CreateScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── navigation/
│   │   │   └── RootNavigator.tsx
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   └── endpoints.ts
│   │   └── store/
│   │       └── store.ts (Zustand)
│   ├── App.tsx
│   ├── app.json
│   └── package.json
└── README.md
```

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon account)
- Expo CLI
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Neon database URL

# Run migrations
npm run migrate

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

### Mobile Setup

```bash
cd mobile
npm install

# Start Expo
npm start

# Run on iOS simulator
i

# Run on Android emulator
a

# Run on web
w
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/signup          - Register new user
POST   /api/v1/auth/login           - Login user
POST   /api/v1/auth/refresh         - Refresh access token
POST   /api/v1/auth/logout          - Logout user
```

### Users
```
GET    /api/v1/users/me             - Get current user profile
GET    /api/v1/users/:id            - Get user profile
PUT    /api/v1/users/me             - Update profile
POST   /api/v1/users/:id/follow     - Follow user
DELETE /api/v1/users/:id/follow     - Unfollow user
GET    /api/v1/users/:id/followers  - Get followers
GET    /api/v1/users/:id/following  - Get following
```

### Videos
```
GET    /api/v1/videos/feed          - Get video feed
GET    /api/v1/videos/:id           - Get video details
POST   /api/v1/videos               - Upload video
POST   /api/v1/videos/:id/like      - Like video
DELETE /api/v1/videos/:id/like      - Unlike video
```

### Comments
```
GET    /api/v1/videos/:id/comments  - Get comments
POST   /api/v1/videos/:id/comments  - Add text comment
POST   /api/v1/videos/:id/comments/voice - Add voice comment
DELETE /api/v1/comments/:id         - Delete comment
```

### Messages
```
GET    /api/v1/messages/conversations         - Get all conversations
GET    /api/v1/messages/conversations/:id    - Get conversation messages
POST   /api/v1/messages                      - Send text message
POST   /api/v1/messages/voice                - Send voice message
DELETE /api/v1/messages/:id                  - Delete message
```

### Notifications
```
GET    /api/v1/notifications       - Get all notifications
PUT    /api/v1/notifications/:id/read - Mark as read
PUT    /api/v1/notifications/read-all - Mark all as read
DELETE /api/v1/notifications/:id   - Delete notification
```

---

## 🔌 WebSocket Events

```javascript
// Connection
socket.emit('user:join', userId)

// Messages
socket.emit('message:send', { conversationId, senderId, recipientId, text_content })
socket.on('message:receive', (data) => { /* handle */ })

// Typing indicators
socket.emit('typing:start', { conversationId, userId })
socket.emit('typing:stop', { conversationId, userId })

// Notifications
socket.on('notification:new', (data) => { /* handle */ })

// User status
socket.on('user:online', { userId })
socket.on('user:offline', { userId })
```

---

## 🗄 Database Schema

### Tables
- **users** - User accounts
- **videos** - Video content
- **comments** - Video comments (text & voice)
- **likes** - Video likes
- **follows** - User follow relationships
- **messages** - Direct messages
- **conversations** - User conversations
- **notifications** - User notifications
- **saves** - Bookmarked videos
- **blocks** - Blocked users
- **reports** - Content reports

---

## 🔐 Security Features

✅ JWT authentication
✅ Password hashing (bcryptjs)
✅ Rate limiting
✅ CORS protection
✅ Helmet security headers
✅ Input validation (Joi)
✅ SQL injection prevention (Knex.js)

---

## 📱 Mobile App Stack

- **React Native** - Native mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Ionicons** - Icons

---

## 🚀 Deployment

### Backend
- Deploy to Heroku, Railway, Render, or AWS
- Ensure PostgreSQL is configured
- Set environment variables

### Mobile
- Build for iOS: `eas build --platform ios`
- Build for Android: `eas build --platform android`
- Submit to App Store/Google Play

---

## 📝 License

MIT License - See LICENSE file

---

## 👨‍💻 Built with ❤️ by Bushort Team

**Your premium short-form video platform is ready to launch!** 🚀
