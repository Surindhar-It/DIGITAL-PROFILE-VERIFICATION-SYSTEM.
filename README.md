Digital Profile Verification System

Project Overview
The Digital Profile Verification System is a full-stack web application designed to help companies verify students' coding profiles during recruitment. The system automatically collects performance data from coding platforms and ranks candidates based on their real technical achievements.
Instead of manually checking resumes and coding profiles, recruiters can use this platform to quickly evaluate candidates through automated verification and leaderboard ranking.

Features

Student profile submission
Automatic coding profile verification
Integration with coding platforms
Admin dashboard for profile management
Leaderboard based on coding performance
Profile verification and rejection system
Export student data to Excel
Secure authentication using JWT

User Roles

Student
Submit personal details
Provide coding profile links
Check verification status
View leaderboard ranking

Admin

Secure login
View all submitted profiles
Verify or reject student profiles
Manage candidate data
Export student data

Technologies Used

Frontend
React.js
Vite
Tailwind CSS
Axios

Backend
Node.js
Express.js

Database
MongoDB
Mongoose

Authentication
JWT (JSON Web Token)
bcryptjs

APIs Used
LeetCode GraphQL API
GitHub REST API
CodeChef data integration

System Architecture

Frontend (React)
↓
Backend (Node.js + Express)
↓
External APIs (LeetCode, GitHub, CodeChef)
↓
MongoDB Database
↓
Admin Dashboard and Leaderboard

Installation and Setup

Install backend dependencies
cd backend
npm install

Install frontend dependencies
cd frontend
npm install

Create environment variables

Create a .env file in the backend folder and add:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GITHUB_TOKEN=your_github_token

Run backend server
npm run dev

Run frontend application
npm run dev

Leaderboard Algorithm

Students are ranked using a scoring system based on coding platform statistics.

Example scoring formula:

Score =
LeetCode solved problems
GitHub repositories
CodeChef rating
Only verified students appear in the leaderboard.

Security Features

Password hashing using bcrypt
JWT authentication
Protected admin routes
Environment variable protection

Advantages

Automated skill verification
Transparent recruitment process
Real-time coding performance analysis
Reduced manual effort for recruiters

Author
Surindhar S
