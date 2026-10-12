# Role-Based Authentication System

A full-stack authentication application built with **React, Vite, Bootstrap, Node.js, Express.js, and MongoDB**. It provides a single login page that automatically redirects authenticated users to the correct dashboard based on their role.

## Features

- **Single Login Page:** One login form for all users.
- **Role-Based Redirection:** Automatically redirects users to their respective dashboards.
- **Three User Roles:** Admin, Manager, and User.
- **Secure Password Storage:** Passwords are hashed using `bcryptjs`.
- **JWT Authentication:** Uses JSON Web Tokens for authentication.
- **HTTP-Only Cookies:** Stores the authentication token in an HTTP-only cookie.
- **Session Restoration:** Restores the logged-in session after refreshing the page.
- **Protected Routes:** Prevents users from accessing other roles' dashboards through normal frontend navigation.
- **Backend Authorization:** Includes role-based middleware for protecting API endpoints.
- **Logout Functionality:** Allows users to sign out.
- **Responsive UI:** Uses Bootstrap for a responsive interface.

## Tech Stack

**Frontend**
- React
- Vite
- Bootstrap
- Axios
- React Router DOM

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs`
- `cookie-parser`
- `cors`
- `dotenv`

## How It Works

1. The user opens the single login page.
2. The user enters their email address and password.
3. The Express backend searches for the account in MongoDB.
4. The backend verifies the password against its stored hash.
5. After successful authentication, the backend issues a JWT in an HTTP-only cookie.
6. The backend returns the user's role from the database.
7. React automatically redirects the user to the appropriate dashboard.

| Role | Dashboard |
|---|---|
| Admin | `/admin` |
| Manager | `/manager` |
| User | `/user` |

**Important:** Users do not select their role on the login page. Their role is retrieved from the database.

## Project Structure

```text
role-login-app/
├── public/
├── src/
│   ├── App.jsx
│   ├── api.js
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Prerequisites

Before running the application, install or configure:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) database, or a local MongoDB server
- Visual Studio Code (recommended)

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd role-login-app
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's actual URL.

### 2. Install frontend dependencies

Run from the project root:

```bash
npm install
npm install bootstrap axios react-router-dom
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create `server/.env`:

```dotenv
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Replace the MongoDB URI and JWT secret with your own values.

Do not commit `.env` or expose database credentials, passwords, or JWT secrets publicly.

### 5. Create the demo accounts

Ensure your MongoDB Atlas database is accessible, then run:

```bash
npm run seed
```

The seed script creates the Admin, Manager, and User demo accounts if they do not already exist.

### 6. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 7. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Demo Accounts

For local development, the seed script creates these accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@system.com` | `Admin@12345` |
| Manager | `manager@system.com` | `Manager@12345` |
| User | `user@system.com` | `User@12345` |

These are development-only credentials. Never use them in production.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve the current authenticated user |
| POST | `/auth/logout` | Clear the authentication cookie |
| GET | `/auth/admin-only` | Example admin-only endpoint |
| GET | `/auth/manager-only` | Example manager/admin endpoint |
| GET | `/auth/user-only` | Example user-only endpoint |

## Security Notes

- Passwords are hashed using `bcryptjs` before being stored.
- JWTs are stored in HTTP-only cookies.
- Backend middleware checks authentication and role permissions.
- Frontend route protection improves navigation but is not a substitute for backend authorization.
- Production deployments should use HTTPS, strong secrets, login rate limiting, and appropriate CSRF protection.
- Demo credentials must be replaced before deployment.
- Environment files containing secrets must never be committed to GitHub.

## Future Improvements

- User registration and password reset
- Admin panel for managing users and roles
- Profile management
- Login rate limiting and stronger session management
- Automated tests
- Production deployment with HTTPS

## Learning Outcomes

This project demonstrates practical implementation of:

- Full-stack application development
- REST API integration
- Authentication and authorization
- JWT-based sessions
- MongoDB data modeling
- React routing and protected dashboards
- Environment variable configuration
- Role-based access control

## Author

**Your Name**

GitHub: https://github.com/dkgupta76/synapes-authintication

---
