# Social Media App - Setup Guide

## MongoDB Database Setup with Sessions and Cookies

This application uses MongoDB for data storage, Express sessions for authentication, and HTTP-only cookies for security.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file already contains:

```env
MONGODB_URI=mongodb+srv://<your_username>:CtIRDhrfiN4JJEJv@<your_database>.jwoeqir.mongodb.net/<your_db>?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-change-in-production-2024
NODE_ENV=development
PORT=5000
```

**Important:** Change the `SESSION_SECRET` in production!

### 3. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default)

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST /api/auth/register** - Register a new user
  - Body: `{ name, username, email, password }`
  - Returns: User data + creates session

- **POST /api/auth/login** - Login user
  - Body: `{ email, password }`
  - Returns: User data + creates session

- **POST /api/auth/logout** - Logout user
  - Destroys session and clears cookie

- **GET /api/auth/check** - Check authentication status
  - Returns: User data if authenticated

### Profile Routes (`/api/profile`)

- **GET /api/profile** - Get current user's profile (requires authentication)
  - Returns: User profile data

- **GET /api/profile/:username** - Get user profile by username (public)
  - Returns: Public user profile

- **PUT /api/profile/update** - Update profile (requires authentication)
  - Body: `{ name, bio, location, website }`
  - Returns: Updated user data

- **POST /api/profile/follow/:userId** - Follow a user (requires authentication)

- **POST /api/profile/unfollow/:userId** - Unfollow a user (requires authentication)

## Database Schema

### User Model

```javascript
{
  name: String (required),
  username: String (required, unique, lowercase),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  bio: String (max 500 chars),
  location: String,
  website: String,
  avatar: String (auto-generated from initials),
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## Session Management

- **Session Store:** MongoDB (using connect-mongo)
- **Session Duration:** 7 days
- **Cookie Settings:**
  - HttpOnly: true (prevents XSS)
  - Secure: true (in production, requires HTTPS)
  - SameSite: 'lax' (CSRF protection)

## Security Features

1. **Password Hashing:** bcryptjs with salt rounds
2. **Session-based Authentication:** No JWT tokens needed
3. **HTTP-only Cookies:** Prevents XSS attacks
4. **CORS Configuration:** Restricts API access
5. **Password Requirements:** Minimum 6 characters

## Testing the API

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Get Profile (with session cookie)

```bash
curl -X GET http://localhost:5000/api/profile \
  -b cookies.txt
```

### Update Profile

```bash
curl -X PUT http://localhost:5000/api/profile/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bio": "Software Developer | Tech Enthusiast",
    "location": "San Francisco, CA",
    "website": "https://johndoe.dev"
  }'
```

## Frontend Features

- **Profile Page** (`/profile`)
  - View user profile with stats
  - Edit profile information
  - View posts, media, and likes tabs
  - Follow/unfollow functionality

- **Automatic Session Management**
  - Frontend automatically sends cookies with requests
  - Session persists across page refreshes
  - Auto-logout on session expiration

## Troubleshooting

### CORS Issues
- Ensure frontend runs on `http://localhost:5173`
- Check CORS configuration in `backend/server.js`

### Session Not Persisting
- Verify cookies are enabled in browser
- Check `credentials: 'include'` in fetch requests
- Ensure MongoDB connection is active

### MongoDB Connection Error
- Check internet connection
- Verify MongoDB URI in `.env`
- Ensure database name is correct

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Change `SESSION_SECRET` to a strong random string
3. Use HTTPS for secure cookies
4. Set appropriate CORS origins
5. Use environment-specific MongoDB URIs

## Project Structure

```
Social-Media-App/
├── backend/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── profile.js         # Profile routes
│   ├── server.js              # Express server setup
│   ├── package.json
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Profile.jsx    # Profile page with API integration
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── SETUP.md                   # This file
```
