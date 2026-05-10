# EventSphere

**The all-in-one platform to host, manage, and discover events.**

EventSphere is a full-stack MERN application built to demonstrate advanced product thinking, robust backend architecture, and a highly polished user experience. It provides comprehensive tools for event organizers and attendees, leveraging modern web technologies and artificial intelligence for seamless event management.

![EventSphere Banner](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop)
---

## Table of Contents

1. [Core Features](#core-features)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Author](#author)

---

## Core Features

- **Authentication & Authorization**: Secure JWT-based login and registration system with protected routing and strict user ownership validations.
- **Atomic RSVP System**: Race-condition-safe RSVP capacity management utilizing MongoDB `$expr` to ensure events never exceed their maximum capacity, even under concurrent load.
- **AI-Powered Event Generation**: Seamless event creation powered by the Google Gemini AI SDK. Users can input a title and location, and the system automatically generates an engaging, context-aware event description.
- **Image Hosting & Optimization**: Direct integration with Cloudinary for scalable, optimized image uploads and delivery.
- **Dashboard & User Profiles**: Personalized user hubs for tracking hosted events, managing active RSVPs, and updating account credentials.
- **Advanced Search & Filtering**: Real-time debounced search queries, categorical filtering, and paginated event feeds for optimal data retrieval.
- **Responsive UI/UX**: Built with a custom Tailwind CSS design system and Framer Motion for fluid page transitions, interactive components, and comprehensive error handling.

---

## Architecture Highlights

### The Atomic RSVP Mechanism
When multiple users attempt to RSVP to the last remaining spot simultaneously, standard database queries can fail and result in overbooking. EventSphere mitigates this race condition using MongoDB's `$expr` operator in a single atomic update operation:

```javascript
const event = await Event.findOneAndUpdate(
  {
    _id: eventId,
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }
  },
  { $addToSet: { attendees: req.user.id } },
  { new: true }
);
```
If the event is at maximum capacity, the query matches zero documents, preventing overbooking strictly at the database layer.

---

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion, GSAP, React Three Fiber
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend
- **Environment**: Node.js & Express.js
- **Database**: MongoDB Atlas & Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.js
- **Media Storage**: Cloudinary & Multer
- **AI Integration**: Google Generative AI (Gemini SDK)

---

## Installation & Setup

Follow these instructions to run EventSphere locally on your development machine.

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- MongoDB account or local instance
- Cloudinary account
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/hansel06/mern-fun.git
cd mern-fun
```

### 2. Backend Configuration
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Configuration
Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the `server` directory and configure the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## Author

Developed by Hansel Thomas Dsouza.

- LinkedIn: [Hansel Thomas D'Souza](https://linkedin.com/in/yourprofile)
- GitHub: [Hansel06](https://github.com/hansel06)

*This project was developed following a strict agile methodology, evolving from a functional API into a production-ready application.*
