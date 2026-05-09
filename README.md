# EventSphere 🌐

**The all-in-one platform to host, manage, and discover amazing events happening near you.**

EventSphere is a full-stack, internship-ready MERN application built to demonstrate advanced product thinking, robust backend architecture, and a highly polished user experience. 

![EventSphere Banner](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop)

---

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based login/signup with protected routing and user ownership checks.
- **Atomic RSVP System**: Race-condition-safe RSVP capacity management using MongoDB `$expr` to ensure events never overbook.
- **AI Description Generation**: Effortless event creation powered by **Google Gemini AI**. Just type a title and location, and Gemini writes the perfect engaging description for you.
- **Image Hosting**: Direct Cloudinary integration for scalable, optimized image uploads.
- **Dashboard & Profile**: Personalized user hubs to track hosted events, manage RSVPs, and update account settings.
- **Search & Filtering**: Real-time debounce search, category filtering, and paginated event feeds.
- **Polished UI/UX**: Built with Tailwind CSS and Framer Motion for buttery smooth page transitions, interactive hover states, and fully illustrated empty states. 
- **Error Resilient**: Features a global React Error Boundary and custom 404 pages to prevent blank screen crashes.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** (Custom Design System)
- **Framer Motion** (Page Transitions)
- **React Router v6**
- **React Hot Toast** (Notifications)
- **Lucide React** (Icons)
- **Axios** (API Client)

### Backend
- **Node.js & Express.js**
- **MongoDB Atlas & Mongoose**
- **JWT** (JSON Web Tokens)
- **Bcrypt.js** (Password Hashing)
- **Cloudinary & Multer** (Image Uploads)
- **Google Generative AI** (Gemini SDK)

---

## 🚀 Getting Started

Follow these steps to run EventSphere locally on your machine.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB account (or local instance)
- Cloudinary account
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/eventsphere.git
cd eventsphere
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🏗️ Architecture Highlights

### The Atomic RSVP Problem
When multiple users try to RSVP to the last remaining spot at the exact same millisecond, standard database queries can fail and overbook the event. EventSphere solves this race condition using MongoDB's `$expr` operator in a single atomic update:

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
If the event is full, the query simply matches 0 documents, preventing overbooking at the database level!

---

## 👨‍💻 Author

Built with ❤️ by **Hansel Thomas Dsouza**

- LinkedIn: [Hansel Thomas D'Souza](https://linkedin.com/in/yourprofile)
- GitHub: [Hansel06](https://github.com/hansel06)

---

*This project was developed following a strict 4-Sprint agile methodology, evolving from a functional API into a polished, production-ready product.*
