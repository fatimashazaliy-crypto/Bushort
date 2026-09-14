# BUSHORT Backend API

Production-ready Node.js + Express API for BUSHORT premium short-form video social platform.

## Features

✅ User Authentication & Authorization (JWT)  
✅ Real-time Chat with Socket.io  
✅ Video Upload & Streaming  
✅ Comment System with Voice Comments  
✅ Like, Follow, Share System  
✅ Notifications  
✅ Video Feed with Pagination  
✅ User Profiles  
✅ Rate Limiting & Security  
✅ PostgreSQL Database (Neon)  
✅ AWS S3 Video Storage  
✅ Redis Caching  

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon)
- AWS S3 Account
- Redis (optional, for caching)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

```bash
cp .env.example .env
# Edit .env with your actual values
```

### Database Setup

```bash
npm run migrate  # Create tables
npm run seed     # Add sample data (optional)
```

### Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `GET /api/v1/auth/profile` - Get current user profile

### Videos
- `GET /api/v1/videos/feed` - Get video feed (paginated)
- `GET /api/v1/videos/:id` - Get single video
- `POST /api/v1/videos` - Upload new video
- `PUT /api/v1/videos/:id` - Update video metadata
- `DELETE /api/v1/videos/:id` - Delete video
- `POST /api/v1/videos/:id/like` - Like video
- `DELETE /api/v1/videos/:id/like` - Unlike video

### Comments
- `GET /api/v1/videos/:id/comments` - Get video comments
- `POST /api/v1/videos/:id/comments` - Add text comment
- `POST /api/v1/videos/:id/comments/voice` - Add voice comment
- `DELETE /api/v1/comments/:id` - Delete comment

### Messages
- `GET /api/v1/messages/conversations` - Get all conversations
- `GET /api/v1/messages/conversations/:id` - Get conversation messages
- `POST /api/v1/messages` - Send text message
- `POST /api/v1/messages/voice` - Send voice message
- `DELETE /api/v1/messages/:id` - Delete message

### Users & Profiles
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `POST /api/v1/users/:id/follow` - Follow user
- `DELETE /api/v1/users/:id/follow` - Unfollow user
- `GET /api/v1/users/:id/followers` - Get user followers
- `GET /api/v1/users/:id/following` - Get user following

### Notifications
- `GET /api/v1/notifications` - Get all notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `DELETE /api/v1/notifications/:id` - Delete notification

## WebSocket Events (Real-time)

- `message:send` - Send real-time message
- `message:receive` - Receive real-time message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `notification:new` - New notification
- `user:online` - User came online
- `user:offline` - User went offline

## Deployment

```bash
npm run build
npm start
```

Recommended platforms: Heroku, Railway, Render, or AWS EC2

## License

MIT
