# 🛡️ Digital Profile Verification System

A modern full-stack web application that streamlines the recruitment process by verifying student coding profiles. Built for companies to efficiently manage, verify, and rank student submissions from competitive programming platforms.

🌐 **Live Demo:** [digital-profile-verification-system.vercel.app](https://digital-profile-verification-system.vercel.app)

---

## ✨ Features

### 👨‍🎓 Student Module
- Register with personal details and coding profile URLs
- Auto-fetches stats from **LeetCode**, **GitHub**, and **CodeChef** on submission
- Track application status (Pending / Verified / Rejected)
- Resubmit profile after rejection
- View public leaderboard

### 🔐 Admin Module
- Secure JWT-based admin login
- View all student submissions with real-time auto-refresh
- Verify or reject students individually or in bulk
- Delete student records
- Leaderboard view filtered by platform (LeetCode, GitHub, CodeChef, Codeforces)
- Export leaderboard data to **Excel (.xlsx)**

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 19, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas (Cloud) |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **APIs** | LeetCode GraphQL, GitHub REST API, CodeChef (scraper) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/Surindhar-It/DIGITAL-PROFILE-VERIFICATION-SYSTEM.git
cd DIGITAL-PROFILE-VERIFICATION-SYSTEM
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (use `.env.example` as reference):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/digital_verif_system
JWT_SECRET=your_jwt_secret_key
GITHUB_TOKEN=your_github_personal_access_token
```

Seed the admin account:
```bash
node seedAdmin.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🔑 Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@company.com` |
| Password | `adminpassword` |

> ⚠️ Change these in `seedAdmin.js` before deploying to production.

---

## 📁 Project Structure

```
digital_profile_verification_system/
├── backend/
│   ├── models/          # Mongoose schemas (Student, Admin)
│   ├── routes/          # API routes (auth, students)
│   ├── middleware/       # JWT auth middleware
│   ├── utils/           # LeetCode, GitHub, CodeChef helpers
│   ├── seedAdmin.js     # Admin account seeder
│   └── index.js         # Express server entry point
│
└── frontend/
    └── src/
        ├── api/         # Axios instance
        ├── components/  # ProtectedRoute
        └── pages/       # LandingPage, StudentForm, StatusPage,
                         # AdminLogin, AdminDashboard
```

---

## 🌍 Deployment

| Service | Purpose |
|---------|---------|
| **Render** | Hosts the Node.js backend |
| **Vercel** | Hosts the React frontend |
| **MongoDB Atlas** | Cloud database |

### Environment Variables

**Render (Backend):**
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
GITHUB_TOKEN=your_github_pat
FRONTEND_URL=https://digital-profile-verification-system.vercel.app
```

**Vercel (Frontend):**
```
VITE_API_URL=https://digital-profile-verification-system.onrender.com/api
```

---

## 📸 Pages

| Page | Route | Access |
|------|-------|--------|
| Landing Page | `/` | Public |
| Student Registration | `/register` | Public |
| Status Check | `/status` | Public |
| Admin Login | `/admin` | Public |
| Admin Dashboard | `/admin/dashboard` | Protected |

---

## 📄 License

MIT License — feel free to use and modify.

---

<p align="center">Made with ❤️ for streamlined recruitment verification</p>
