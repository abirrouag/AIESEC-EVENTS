Ran list files in workspace
Analyzed AIESEC_MERN_Antigravity.md:L1-213
Ran check Node and npm versions
Ran check git status · Exited with code 1
Created .gitignore
Created package.json
Ran install server npm packages · Exited with code 1
Canceled run npm install in server directory
Created User.js
Created Event.js
Created Feedback.js
Created protect.js
Created auth.js
Created events.js
Created feedbacks.js
Created server.js
Created .env.example
Created .env
Checked task Run npm install in server directory
Analyzed task-16.log
Checked task Run npm install in server directory
Killed task Run npm install in server directory
Ran run npm install in server directory
Checked task Run npm install in server directory
Analyzed task-46.log
Created package.json
Created vite.config.js
Created index.html
Created api.js
Created index.css
Created main.jsx
Created Navbar.jsx
Created FeedbackList.jsx
Created EventCard.jsx
Created EventForm.jsx
Created Login.jsx
Created Register.jsx
Created Home.jsx
Created App.jsx
Created .env.example
Created .env
Ran install client npm packages
Created README.md
Checked task Install client npm packages
Analyzed task-86.log
Ran list files in client folder
Checked task Install client npm packages
Ran check syntax of server files
Ran test bcrypt and jwt execution
Checked task Install client npm packages
Analyzed task-86.log
Ran check if client node_modules exists
Ran count packages in client node_modules
Ran build React frontend with Vite
Ran test API endpoints with local server · Exited with code 1
Edited server.js
Ran probe server routes locally · Exited with code 1
Created test-server.js
Ran run automated endpoint tests
Ran run automated endpoint tests
Edited package.json
Ran initialize git repository
Ran check git status to verify gitignore
Ran check untracked files in git

The **AIESEC Hub** project has been built according to the brief in [AIESEC_MERN_Antigravity.md](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/AIESEC_MERN_Antigravity.md).

---

### 1. What was done at each step

#### Step 1: Project Setup & Environment Protection

- Initialized the repository structure with [`.gitignore`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/.gitignore) to exclude `node_modules/` and `.env` files.
- Configured [`.env.example`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/.env.example) templates for both `server/` and `client/` to ensure secrets are never committed to GitHub.

#### Step 2: Mongoose Data Models (`server/models/`)

- Created [`User.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/models/User.js): Stores member name, unique lowercase email, and hashed password.
- Created [`Event.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/models/Event.js): Stores title, description, date, and `author` (referencing `User`).
- Created [`Feedback.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/models/Feedback.js): Stores text, `event` reference, `author` reference, and timestamp.
- Established One-to-Many relations using MongoDB `ObjectId` references and `.populate('author', 'name')`.

#### Step 3: Authentication & Middleware (`server/middleware/protect.js`)

- Created the [`protect.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/middleware/protect.js) middleware to guard private routes.
- Extracts `Bearer <token>` from the `Authorization` HTTP header.
- Verifies the signature using `jwt.verify(token, process.env.JWT_SECRET)`.
- Attaches the sanitized user (`req.user = await User.findById(decoded.id).select('-password')`) and calls `next()`.

#### Step 4: Express API Routes (`server/routes/`)

- Created [`auth.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/routes/auth.js):
  - `POST /api/auth/register`: Hashes passwords with `bcryptjs` (salt 10) and returns a signed JWT.
  - `POST /api/auth/login`: Verifies email and password using `bcrypt.compare()` and returns a signed JWT.
- Created [`events.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/routes/events.js):
  - `GET /api/events`: Public list of events sorted by date with populated author names.
  - `POST /api/events`: Protected route to publish a new event.
  - `DELETE /api/events/:id`: Protected route ensuring only the author can delete their event.
- Created [`feedbacks.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/routes/feedbacks.js):
  - `GET /api/feedbacks/:eventId`: Public comments list for an event.
  - `POST /api/feedbacks`: Protected route to add feedback.
  - `DELETE /api/feedbacks/:id`: Protected route ensuring only the feedback author can delete it.

#### Step 5: Server Entry Point (`server/server.js`)

- Created [`server.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/server.js) with CORS enabled for the client origin, JSON body parser, route mounts, and Mongoose connection.
- Added automated endpoint validation ([`test-server.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/server/test-server.js)) verifying status codes `200`, `400`, and `401`.

#### Step 6: React Frontend (`client/src/`)

- Configured [`api.js`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/api.js) with an Axios request interceptor that retrieves the JWT from `localStorage` and automatically attaches `Authorization: Bearer <token>`.
- Built components:
  - [`Navbar.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/components/Navbar.jsx): Header with visitor vs. member view (greeting + Logout).
  - [`EventCard.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/components/EventCard.jsx): Displays event data, author, date, conditional "Delete" button, and toggles comments.
  - [`EventForm.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/components/EventForm.jsx): Controlled form for creating events.
  - [`FeedbackList.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/components/FeedbackList.jsx): Fetches comments with `useEffect`, renders comments, and includes comment submission for logged-in members.
- Built pages:
  - [`Home.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/pages/Home.jsx): Main dashboard showing events and member creation form.
  - [`Login.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/pages/Login.jsx) & [`Register.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/pages/Register.jsx): Authentication pages storing the JWT and profile in `localStorage`.
  - [`App.jsx`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/App.jsx): Root state managing active user and page navigation without extraneous libraries.
  - [`index.css`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/client/src/index.css): Clean, modern styling using AIESEC blue (`#037EF3`).
- Verified production build (`npm run build` in `client`) with Vite.

---

### 2. How to Run Locally

#### Start the Backend

```bash
cd server
npm start
```

*API will run on [http://localhost:5000](http://localhost:5000)*

#### Start the Frontend

In a second terminal:

```bash
cd client
npm run dev
```

*Client will open on [http://localhost:5173](http://localhost:5173)*

---

### 3. Quick Reference for Oral Exam (15/20 Points)

Detailed answers to all 8 oral exam questions are documented in the root [`README.md`](file:///c:/Users/rouag/OneDrive/Bureau/aiesec/README.md#oral-exam-preparation-guide-1520-points):

1. **Express Route Execution:** `(req, res)` handling query, params, body, and status codes (`200`, `201`, `400`, `401`, `403`, `404`).
2. **Password Security:** One-way salt hashing on register (`bcrypt.hash`) and timing-safe comparison on login (`bcrypt.compare`).
3. **JWT Mechanism:** Stateless signing (`jwt.sign`), storage in `localStorage`, and header verification (`jwt.verify`).
4. **`protect` Middleware Flow:** Checks `Authorization` header $\to$ extracts token $\to$ verifies signature $\to$ loads user $\to$ calls `next()`.
5. **React Hooks:** `useState` for reactive UI state; `useEffect` for data fetching on component mount.
6. **Axios Interceptor:** Automatically injects `Authorization: Bearer <token>` into every outgoing HTTP request.
7. **Session Persistence:** Reading `localStorage.getItem('user')` on initial render in `App.jsx`.
8. **Live Modification Example:** Steps to add a `location` field to the `Event` model, route, form, and card.
