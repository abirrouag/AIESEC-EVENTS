# AIESEC Hub – MERN Project (Antigravity Brief)

> Give this file to Antigravity as the project brief.
> Goal: build a **simple, clean, beginner-friendly** MERN app for a student organization like **AIESEC**.
> Every line of code must be **easy to read and easy to explain orally** (15/20 points are for code discussion).

---

## 1. Project Idea

**AIESEC Hub** – a small web app where an AIESEC local committee shares **events** and members can leave **feedback**.

- **Visitor (not logged in):** can only read events and feedback.
- **Member (logged in):** can add events, delete their own events, add and delete feedback.

---

## 2. Rules for the Agent

- Keep the code **simple**: no TypeScript, no Redux, no extra libraries.
- Add a **short comment** above every important block (in English or French).
- Use clear names (`protect`, `registerUser`, `eventSchema`...).
- Do **not** commit any `.env` file.
- Explain each file briefly after creating it.

---

## 3. Tech Stack

| Layer | Tool |
|---|---|
| Database | MongoDB Atlas (M0 free) + Mongoose |
| Back-end | Node.js + Express |
| Auth | JWT + bcrypt |
| Front-end | React 18 + Vite + Axios |
| Deploy | Render (API) + Vercel (client) |

---

## 4. Folder Structure

```
aiesec-hub/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── feedbacks.js
│   ├── middleware/
│   │   └── protect.js
│   ├── server.js
│   ├── package.json
│   └── .env            (NOT on Git)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventForm.jsx
│   │   │   └── FeedbackList.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js       (Axios + JWT interceptor)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env            (NOT on Git)
├── .gitignore
└── README.md
```

---

## 5. Mongoose Models (3 entities)

### User
| Field | Type |
|---|---|
| name | String, required |
| email | String, required, unique |
| password | String, required (hashed with bcrypt) |

### Event (main entity)
| Field | Type |
|---|---|
| title | String, required |
| description | String, required |
| date | Date, required |
| author | ObjectId, `ref: "User"` |

### Feedback (linked entity)
| Field | Type |
|---|---|
| text | String, required |
| event | ObjectId, `ref: "Event"` |
| author | ObjectId, `ref: "User"` |
| createdAt | Date, default now |

### Relations (One-to-Many)
- 1 **User** → N **Events**
- 1 **Event** → N **Feedbacks**
- Use `.populate("author", "name")` when returning events and feedbacks.

---

## 6. API Routes

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account (hash password) → 201 |
| POST | `/api/auth/login` | Public | Check credentials → return JWT |
| GET | `/api/events` | Public | List events (populate author) |
| POST | `/api/events` | **protect** | Add an event |
| DELETE | `/api/events/:id` | **protect** | Delete own event |
| GET | `/api/feedbacks/:eventId` | Public | List feedbacks of an event |
| POST | `/api/feedbacks` | **protect** | Add feedback |
| DELETE | `/api/feedbacks/:id` | **protect** | Delete own feedback |

**HTTP codes:** 200 OK, 201 Created, 400 Bad request, 401 Unauthorized, 403 Forbidden, 404 Not found, 500 Server error.

### `protect` middleware
1. Read `Authorization: Bearer <token>`.
2. If missing → `401`.
3. Verify with `jwt.verify(token, process.env.JWT_SECRET)`.
4. Attach `req.user` and call `next()`.

---

## 7. Front-End Requirements

- **Reusable components:** `Navbar`, `EventCard`, `EventForm`, `FeedbackList`.
- **Controlled forms** for login, register, add event, add feedback.
- **Hooks:** `useState` for form/data, `useEffect` to fetch events on load.
- **Session:** save token in `localStorage`; read it on app start; remove it on logout.
- **Axios interceptor** in `api.js` that adds `Authorization: Bearer <token>` automatically.
- **Conditional rendering:**
  - Visitor → read-only list + "Login / Register" buttons.
  - Logged in → "Add event" form, "Delete" buttons, feedback form, "Logout" button.
- **Style:** simple CSS, AIESEC-inspired colors (blue `#037EF3`, with white background). No UI library.

---

## 8. Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>
CLIENT_URL=<your Vercel URL>
```

**client/.env**
```
VITE_API_URL=<your Render API URL>/api
```

---

## 9. Deployment Steps

1. **MongoDB Atlas:** create free M0 cluster, create user, allow network access (`0.0.0.0/0`), copy URI.
2. **GitHub:** push the repo (with a strict `.gitignore`: `node_modules`, `.env`).
3. **Render:** new Web Service → root directory `server/` → build `npm install` → start `node server.js` → add env variables.
4. **Vercel:** import repo → root directory `client/` → add `VITE_API_URL` → deploy.
5. Enable **CORS** on the API for the Vercel URL only.
6. Test everything over **HTTPS**.

---

## 10. Final Checklist

- [ ] 3 Mongoose models + 1-to-Many relations
- [ ] `.populate()` used
- [ ] Register + Login working
- [ ] Passwords hashed with bcrypt
- [ ] JWT + `protect` middleware on POST and DELETE
- [ ] React SPA with hooks, controlled forms, localStorage, Axios interceptor
- [ ] Visitor vs. member view
- [ ] Deployed on Atlas + Render + Vercel
- [ ] GitHub repo with README and no `.env`
- [ ] Report (5–8 pages) with schemas and screenshots

---

## 11. Oral Exam Prep (15 points)

Be ready to explain **every line**, especially:

- How a route works in Express (`req`, `res`, status codes)
- How bcrypt hashes and compares passwords
- How the JWT is created, sent, and verified
- What the `protect` middleware does step by step
- Why `useState` and `useEffect` are used where they are
- How the Axios interceptor adds the token
- How `localStorage` keeps the user logged in
- Be able to make a small live change (e.g., add a field to Event).

---

## 12. First Prompt to Paste in Antigravity

```
Read this file completely. Build the project step by step following the structure.
Start with the server (models, auth routes, protect middleware, events and feedbacks routes),
test with sample requests, then build the React client. Keep the code simple and commented.
After each step, explain what you did in 3 to 5 lines so I can learn it.
```
