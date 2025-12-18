# Event Management Platform (MERN Stack)

A full-stack web application for creating, viewing, and RSVPing to events. Built with MongoDB, Express.js, React.js, and Node.js.

## 🌐 Live Application

- **Frontend:** [https://hansel-event-platform.vercel.app](https://hansel-event-platform.vercel.app)
- **Backend API:** [https://mern-fun-backend.onrender.com](https://mern-fun-backend.onrender.com)
- **API Health Check:** [https://mern-fun-backend.onrender.com/](https://mern-fun-backend.onrender.com/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Overview](#project-overview)
- [Live URLs](#live-application)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [RSVP Concurrency Solution](#rsvp-concurrency-solution)
- [Deployment](#deployment)

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure sign up and login with JWT tokenization
- ✅ **Event CRUD Operations** - Create, view, edit, and delete events
- ✅ **Image Upload** - Cloudinary integration for event images
- ✅ **RSVP System** - Join and leave events with capacity enforcement
- ✅ **Concurrency-Safe RSVP** - Atomic MongoDB operations prevent overbooking
- ✅ **Protected Routes** - JWT-based authentication middleware
- ✅ **Ownership Authorization** - Only event creators can edit/delete their events
- ✅ **Responsive UI** - Fully responsive design (Desktop, Tablet, Mobile)
- ✅ **AI Description Generation** - Auto-generate event descriptions using Google Gemini AI
- ✅ **Past Event Handling** - Prevents RSVPing to past events with visual indicators

---

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud-hosted database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcryptjs** - Password hashing (salt rounds: 12)
- **Multer** - File upload handling (in-memory storage)
- **Cloudinary** - Cloud image hosting
- **Google Gemini AI** - AI-powered description generation

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - Global state management

---

## 📖 Project Overview

This is a full-stack MERN application that allows users to:

1. **Sign up and log in** securely using JWT tokens
2. **Create events** with details like title, description, date, location, capacity, and images
3. **Browse all events** on a public dashboard
4. **RSVP to events** with strict capacity enforcement
5. **Manage their events** - edit and delete only events they created
6. **Use AI assistance** - auto-generate event descriptions using Google Gemini AI

The application demonstrates:
- Secure authentication and authorization
- CRUD operations with proper ownership checks
- **Critical business logic** - concurrency-safe RSVP system preventing overbooking
- Modern, responsive UI with TypeScript
- Production deployment on Render (backend) and Vercel (frontend)

## 📁 Project Structure

```
MERN/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   └── db.js      # MongoDB connection
│   │   ├── models/        # Database models (User, Event)
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Custom middleware (auth, upload)
│   │   └── app.js         # Express app configuration
│   ├── .env               # Environment variables (not in git)
│   ├── .env.example       # Environment template
│   ├── package.json
│   └── server.js          # Entry point
│
└── client/                # Frontend React app
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── context/       # React Context (Auth)
    │   ├── services/      # API service layer
    │   ├── types/         # TypeScript type definitions
    │   └── utils/         # Utility functions
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (free tier available)
- **Cloudinary account** (free tier available)
- **Git** (for cloning the repository)

---

### Installation

1. **Clone the repository** (or download the project)
   ```bash
   git clone <repository-url>
   cd MERN
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

---

### Environment Setup

1. **Create `.env` file in the `server` folder**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Configure environment variables in `server/.env`**

   ```env
   # Server Configuration
   PORT=5000

   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventplatform?retryWrites=true&w=majority

   # JWT Secret (generate a random secure string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Cloudinary Configuration (get from https://cloudinary.com/dashboard)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Gemini AI Configuration (optional - for AI description generation)
   # Get free API key from https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get MongoDB Atlas Connection String**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0)
   - Create a database user
   - Whitelist your IP address (0.0.0.0/0 for development)
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Append database name: `...mongodb.net/eventplatform?retryWrites...`

4. **Get Cloudinary Credentials**
   - Go to [Cloudinary Dashboard](https://cloudinary.com/dashboard)
   - Sign up for a free account
   - Copy your Cloud Name, API Key, and API Secret

---

### Running the Application

#### Backend Server

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`
   
   You should see:
   ```
   Server running on port 5000
   Environment: development
   MongoDB Connected: [your-cluster-host]
   ```

3. **Test the API**
   - Open browser: `http://localhost:5000`
   - You should see: `{"message": "Event Platform API is running", "status": "success"}`

#### Frontend Client

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (Vite default port)
   
3. **Build for production**
   ```bash
   npm run build
   ```

---

## 📡 API Documentation

### Base URL

**Local Development:**
```
http://localhost:5000/api
```

**Production:**
```
https://mern-fun-backend.onrender.com/api
```

### Endpoints

#### Authentication

**POST /api/auth/signup**
- Register a new user
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "694316136cd046aca8adb8d1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

**POST /api/auth/login**
- Login existing user
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "694316136cd046aca8adb8d1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Events

**GET /api/events**
- Get all events (public)
- **Response (200):**
  ```json
  {
    "success": true,
    "count": 2,
    "events": [...]
  }
  ```

**GET /api/events/:id**
- Get single event by ID (public)
- **Response (200):**
  ```json
  {
    "success": true,
    "event": {
      "_id": "...",
      "title": "Summer Party",
      "description": "...",
      "date": "2024-07-15T18:00:00.000Z",
      "location": "Beach",
      "capacity": 50,
      "imageUrl": "https://...",
      "createdBy": {...},
      "attendees": [...]
    }
  }
  ```

**POST /api/events**
- Create new event (protected - requires JWT token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
  - `title` (string, required)
  - `description` (string, required)
  - `date` (string, required, ISO format)
  - `location` (string, required)
  - `capacity` (number, required, min: 1)
  - `image` (file, required, image only, max 5MB)
- **Response (201):**
  ```json
  {
    "success": true,
    "event": {...}
  }
  ```

**PUT /api/events/:id**
- Update event (protected - creator only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data` (all fields optional except those being updated)
  - `title`, `description`, `date`, `location`, `capacity`, `image`
- **Response (200):**
  ```json
  {
    "success": true,
    "event": {...}
  }
  ```

**DELETE /api/events/:id**
- Delete event (protected - creator only)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Event deleted successfully"
  }
  ```

#### RSVP

**POST /api/events/:id/rsvp**
- Join/RSVP to an event (protected - requires JWT token)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Successfully RSVPed to event",
    "event": {...}
  }
  ```
- **Error Responses:**
  - `400` - "Event is full" or "You have already RSVPed to this event"
  - `404` - "Event not found"

**POST /api/events/:id/cancel**
- Cancel RSVP (leave event) (protected - requires JWT token)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "RSVP cancelled successfully",
    "event": {...}
  }
  ```
- **Error Responses:**
  - `400` - "You are not RSVPed to this event"
  - `404` - "Event not found"

#### AI Description Generation

**POST /api/events/generate-description**
- Generate event description using AI (protected - requires JWT token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Summer Party",
    "location": "Beach Park",
    "date": "2024-07-15T18:00:00Z",
    "capacity": 50
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "description": "Join us for an exciting summer party at Beach Park..."
  }
  ```
- **Note:** `date` and `capacity` are optional. `title` and `location` are required.

---

## 🔒 RSVP Concurrency Solution

### Problem Statement

When multiple users attempt to RSVP simultaneously for an event at capacity, there's a **race condition** risk that can lead to overbooking.

#### The Race Condition Scenario:

Imagine an event with capacity 10, currently having 9 attendees:

1. **User A's request** arrives at time T1:
   - Checks capacity: `attendees.length` (9) < `capacity` (10) ✅ Pass
   - Proceeds to add user A to attendees

2. **User B's request** arrives at time T2 (simultaneously):
   - Checks capacity: `attendees.length` (9) < `capacity` (10) ✅ Pass (still sees 9!)
   - Proceeds to add user B to attendees

3. **Result:** Both users are added → 11 attendees in a 10-capacity event ❌ **OVERBOOKED!**

This happens because the **check** and **update** operations are separate, creating a timing window where multiple requests can all see the same state before any of them update it.

### Why Frontend Checks Aren't Enough

Even if the frontend validates capacity before sending the request:

```javascript
// Frontend code (NOT SAFE)
if (event.attendees.length < event.capacity) {
  // Send RSVP request
}
```

**Problems:**
1. **Network latency** creates gaps between check and update
2. **Multiple simultaneous requests** can all pass the frontend check
3. **Frontend validation can be bypassed** (direct API calls, modified client code)
4. **Separate operations** - check and update are not atomic

Only **backend database-level atomic operations** can guarantee data integrity.

### Solution Strategy

We use **MongoDB atomic operations** to ensure that capacity checking and RSVP addition happen **atomically** in a **single database operation**. This eliminates the race condition entirely.

### Implementation Details

The solution uses MongoDB's `findOneAndUpdate` with conditional query operators to combine the check and update into one atomic operation.

#### The Atomic Query:

```javascript
const event = await Event.findOneAndUpdate(
  {
    _id: id,
    // Capacity check: size of attendees array must be less than capacity
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
    // Duplicate check: userId must not already be in attendees array
    attendees: { $ne: userId }
  },
  {
    // Update: add userId to attendees array (only if not already present)
    $addToSet: { attendees: userId }
  },
  { new: true }  // Return the updated document
);
```

#### Key MongoDB Operators:

1. **`$expr`** - Allows using aggregation expressions in query conditions
2. **`$size`** - Returns the number of elements in the attendees array
3. **`$lt`** - Less than comparison operator
4. **`$ne`** - Not equal operator (ensures user not already in array)
5. **`$addToSet`** - Adds value to array only if it doesn't already exist (prevents duplicates)

#### How It Works:

1. **Query Conditions:** MongoDB only matches documents where:
   - The event ID matches
   - **AND** the attendees array size is less than capacity (`$expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }`)
   - **AND** the userId is not already in attendees (`attendees: { $ne: userId }`)

2. **Atomic Update:** If all conditions are met, MongoDB atomically:
   - Adds the userId to the attendees array using `$addToSet`
   - Returns the updated document

3. **Atomicity Guarantee:** MongoDB ensures that this entire operation (match + update) happens **atomically** - no other operation can interleave between the check and the update.

4. **Failure Handling:** If the query doesn't match (capacity full or user already RSVPed), no update occurs, and `event` will be `null`. We then check the original event to determine the specific failure reason.

#### Complete Implementation:

```javascript
export const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Atomic operation - checks capacity and adds user in one database operation
    const event = await Event.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },  // Capacity check
        attendees: { $ne: userId }  // Not already in attendees
      },
      {
        $addToSet: { attendees: userId }  // Add user atomically (prevents duplicates)
      },
      { new: true }  // Return updated document
    );

    // If update failed, determine the reason
    if (!event) {
      const originalEvent = await Event.findById(id);

      if (!originalEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      if (originalEvent.attendees.some(attendee => attendee.toString() === userId)) {
        return res.status(400).json({
          success: false,
          message: 'You have already RSVPed to this event'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Success
    await event.populate('attendees', 'name email');
    res.status(200).json({
      success: true,
      message: 'Successfully RSVPed to event',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

### Why This Solution Works

1. **Atomicity:** The check and update happen in a single database operation that MongoDB guarantees is atomic
2. **No Race Conditions:** Even if 100 users try to RSVP simultaneously for the last spot, only one will succeed
3. **Database-Level Enforcement:** The constraint is enforced at the database level, not application level
4. **Concurrent-Safe:** Multiple simultaneous requests are handled correctly by MongoDB's concurrency control
5. **Duplicate Prevention:** `$addToSet` and `$ne` ensure no duplicate RSVPs

### Testing the Solution

To verify this works under concurrency:
1. Create an event with capacity 1
2. Have two users attempt to RSVP simultaneously
3. Only one should succeed, the other should receive "Event is full"
4. This proves the atomic operation prevents overbooking

This implementation fully satisfies the assignment requirement for handling capacity and concurrency challenges.

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push origin main
   ```

2. **Create new Web Service on Render**
   - Connect your GitHub repository
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Set environment: `Node`

3. **Add environment variables in Render dashboard:**
   - `PORT` (optional, defaults to 5000)
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `GEMINI_API_KEY` (optional, for AI features)

4. **Deploy** - Render will automatically deploy on every push

**Live Backend:** [https://mern-fun-backend.onrender.com](https://mern-fun-backend.onrender.com)

### Frontend Deployment (Vercel)

1. **Push code to GitHub**

2. **Import project to Vercel**
   - Connect your GitHub repository
   - Set root directory to `client`
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add environment variables:**
   - `VITE_API_URL` = `https://mern-fun-backend.onrender.com/api`

4. **Deploy** - Vercel will automatically deploy on every push

**Live Frontend:** [https://hansel-event-platform.vercel.app](https://hansel-event-platform.vercel.app)

### Database

- **MongoDB Atlas** - Cloud-hosted MongoDB (free tier available)
- Network Access: Configure `0.0.0.0/0` to allow Render servers to connect

---

## 📝 Notes

- This project is built as part of a technical screening assignment
- Code follows industry best practices for security and scalability
- All sensitive data is stored in environment variables

---

## 👤 Author

Hansel Thomas Dsouza

---

## 📄 License

ISC

