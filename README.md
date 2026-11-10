# 🌐 AIESEC Hub – MERN Stack Application

A clean, beginner-friendly MERN (MongoDB, Express, React, Node.js) web application designed for student organizations like **AIESEC**. 
AIESEC Hub enables local committees to publish **events** (leadership workshops, global villages, exchange briefings) and lets members submit **feedbacks**.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Mongoose Data Models & Relations](#-mongoose-data-models--relations)
5. [API Endpoints](#-api-endpoints)
6. [Local Installation & Setup](#-local-installation--setup)
7. [Deployment Guide (Render + Vercel)](#-deployment-guide-render--vercel)
8. [Oral Exam Preparation Guide (15/20 Points)](#-oral-exam-preparation-guide-1520-points)

---

## ✨ Key Features

- **Public Access (Visitors):**
  - View all published AIESEC events.
  - Read feedback and ratings left by members.
  - Seamless navigation to login or registration.

- **Member Access (Logged In):**
  - Create new committee events (Title, Date, Description).
  - Delete **only their own** events.
  - Leave comments/feedback on any event.
  - Delete **only their own** feedback.
  - Secure JWT-based session with persistent `localStorage`.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Database** | MongoDB Atlas / Local MongoDB + Mongoose | Data modeling, validation, and persistence |
| **Backend** | Node.js + Express.js | RESTful API server, routing, and controllers |
| **Authentication**| JSON Web Tokens (JWT) + bcryptjs | Secure password hashing & stateless token auth |
| **Frontend** | React 18 + Vite | Single Page Application (SPA), React hooks |
| **HTTP Client** | Axios | Request interceptor attaching `Bearer <token>` |
| **Styling** | Clean Pure CSS | Responsive, AIESEC Blue `#037EF3` branding |

---

## 📂 Project Structure

```text
aiesec/
├── server/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password)
│   │   ├── Event.js         # Event schema (title, description, date, author)
│   │   └── Feedback.js      # Feedback schema (text, event, author, createdAt)
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login
│   │   ├── events.js        # GET, POST, DELETE /api/events
│   │   └── feedbacks.js     # GET, POST, DELETE /api/feedbacks
│   ├── middleware/
│   │   └── protect.js       # JWT verification middleware
│   ├── .env.example         # Example server environment configuration
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express app entry point & DB connection
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header & navigation
│   │   │   ├── EventCard.jsx    # Event item card & toggle feedback
│   │   │   ├── EventForm.jsx    # Controlled form for new events
│   │   │   └── FeedbackList.jsx # Feedback comments list & input
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Events list & member dashboard
│   │   │   ├── Login.jsx        # Member authentication
│   │   │   └── Register.jsx     # Member registration
│   │   ├── api.js               # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Main React state & route controller
│   │   ├── index.css            # Clean AIESEC-themed stylesheet
│   │   └── main.jsx             # React DOM root render
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite build config
│   ├── .env.example         # Example client environment configuration
│   └── package.json         # Frontend dependencies & scripts
├── .gitignore               # Ignores node_modules and .env files
└── README.md                # Documentation & presentation guide
```

---

## 🗄️ Mongoose Data Models & Relations

### 1. `User` Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcryptjs
  timestamps: true
}
```

### 2. `Event` Model
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamps: true
}
```

### 3. `Feedback` Model
```javascript
{
  text: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Relations (One-to-Many):
- **1 User → Many Events:** An organizer creates multiple events.
- **1 Event → Many Feedbacks:** Multiple members comment on an event.
- **Populate:** Queries use `.populate('author', 'name')` to attach the author's public name while excluding sensitive fields (like password).

---

## 🚀 API Endpoints

| Method | Endpoint | Access | Description | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new user account & return JWT | `201`, `400`, `500` |
| `POST` | `/api/auth/login` | Public | Validate email/password & return JWT | `200`, `400`, `500` |
| `GET` | `/api/events` | Public | Fetch all events (populated with author name) | `200`, `500` |
| `POST` | `/api/events` | **Protected** | Create an event (author set to `req.user._id`) | `201`, `400`, `401`, `500` |
| `DELETE`| `/api/events/:id` | **Protected** | Delete event (checks ownership) | `200`, `401`, `403`, `404`, `500` |
| `GET` | `/api/feedbacks/:eventId` | Public | Fetch all comments for a specific event | `200`, `500` |
| `POST` | `/api/feedbacks` | **Protected** | Add feedback to an event | `201`, `400`, `401`, `404`, `500` |
| `DELETE`| `/api/feedbacks/:id` | **Protected** | Delete feedback (checks ownership) | `200`, `401`, `403`, `404`, `500` |

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance running or MongoDB Atlas connection string)

### 1. Clone & Setup Backend
```bash
cd server
npm install
```

Configure `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aiesec-hub
JWT_SECRET=your_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
# or development watch mode:
npm run dev
```

### 2. Setup Frontend
In another terminal window:
```bash
cd client
npm install
```

Configure `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment Guide (Render + Vercel)

### Step 1: MongoDB Atlas
1. Create a free M0 cluster on [cloud.mongodb.com](https://cloud.mongodb.com).
2. Under **Database Access**, create a user with read/write access.
3. Under **Network Access**, allow IP `0.0.0.0/0` (all IPs).
4. Copy the connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/aiesec-hub?retryWrites=true&w=majority`.

### Step 2: Push code to GitHub
Make sure `.gitignore` excludes `node_modules` and `.env`.

### Step 3: Deploy Backend on Render
1. Create a **New Web Service** pointing to your GitHub repository.
2. Root Directory: `server`.
3. Build Command: `npm install`.
4. Start Command: `node server.js`.
5. Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `<Atlas URI>`
   - `JWT_SECRET`: `<Random 32-char string>`
   - `CLIENT_URL`: `<Your Vercel Domain>`

### Step 4: Deploy Frontend on Vercel
1. Import your GitHub repo on [vercel.com](https://vercel.com).
2. Root Directory: `client`.
3. Framework Preset: `Vite`.
4. Environment Variables:
   - `VITE_API_URL`: `https://<your-render-service>.onrender.com/api`
5. Click **Deploy**.

---

## 🎓 Oral Exam Preparation Guide (15/20 Points)

Here is a summary of the most common questions asked during the project defense:

### 1. How does an Express route work?
- Express listens for incoming HTTP requests matching a specific method (`GET`, `POST`, `DELETE`) and path.
- The route handler receives `(req, res)`:
  - `req` (Request): contains headers, route parameters (`req.params`), query strings (`req.query`), and request body (`req.body`).
  - `res` (Response): sends back status codes (e.g. `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`) and JSON data (`res.json(...)`).

### 2. How does `bcrypt` hash and compare passwords?
- **Hashing during registration:** `bcrypt.hash(password, saltRounds)` creates an irreversible one-way cryptographic hash with a random salt preventing rainbow table attacks.
- **Comparing during login:** `bcrypt.compare(candidatePassword, user.password)` hashes the incoming password using the exact same salt and checks if both hashes match. The plain text password is never stored or logged.

### 3. How does JWT authentication work?
- **Generation:** On login or registration, the backend signs a token with `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
- **Transmission:** The client saves the token in `localStorage` and includes it in the HTTP `Authorization: Bearer <token>` header for subsequent requests.
- **Verification:** The backend verifies the token's digital signature using `jwt.verify(token, process.env.JWT_SECRET)` to extract the user's ID without querying the database for session state (stateless authentication).

### 4. What does the `protect` middleware do step by step?
1. Checks for the `Authorization` header starting with `Bearer `. If absent, returns `401 Unauthorized`.
2. Extracts the token string following `Bearer `.
3. Validates the signature with `jwt.verify()`.
4. Retrieves the user object from the database excluding the password field (`User.findById(decoded.id).select('-password')`).
5. Attaches the user object to `req.user` and calls `next()` to hand over execution to the route handler.

### 5. Why are `useState` and `useEffect` used in React?
- `useState`: Holds component state that triggers a re-render when modified (e.g., input values in controlled forms, event arrays, authentication state).
- `useEffect`: Manages side effects such as fetching data from the backend API when a component is mounted (rendered for the first time).

### 6. How does the Axios interceptor work?
- In `src/api.js`, `api.interceptors.request.use()` intercepts every outgoing HTTP request before it leaves the browser.
- It checks `localStorage.getItem('token')`. If present, it attaches `config.headers.Authorization = 'Bearer ' + token`, ensuring all protected endpoints receive the token automatically without duplicating code.

### 7. How does `localStorage` maintain user session?
- When the user logs in, the token and user profile are saved in browser `localStorage`.
- When the user refreshes or reopens the page, `App.jsx` reads `localStorage.getItem('user')` during state initialization, keeping the user logged in until they click "Logout".

### 8. Example live modification: Add a "location" field to Event
1. In `server/models/Event.js`: Add `location: { type: String, required: true }`.
2. In `server/routes/events.js`: Extract `const { title, description, date, location } = req.body;` and pass it to `Event.create({ ... })`.
3. In `client/src/components/EventForm.jsx`: Add `const [location, setLocation] = useState('');` and a form input field.
4. In `client/src/components/EventCard.jsx`: Render `📍 {event.location}` in the card.

