import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "./api";

const dashboardPaths = {
  admin: "/admin",
  manager: "/manager",
  user: "/user",
};

function getDashboardPath(role) {
  return dashboardPaths[role] || "/login";
}

function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const loggedInUser = response.data.user;
      setUser(loggedInUser);

      // Automatically redirect according to the database role.
      navigate(getDashboardPath(loggedInUser.role), {
        replace: true,
        state: { justLoggedIn: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Check that the server is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="card login-card shadow-lg border-0">
        <div className="card-body p-4 p-md-5">
          <div className="brand-mark mx-auto mb-3">A</div>

          <h1 className="h3 text-center fw-bold mb-2">Welcome back</h1>
          <p className="text-secondary text-center mb-4">
            Sign in to continue to your account
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="you@example.com"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="small text-secondary text-center mt-4 mb-0">
            Secure access to your workspace
          </p>
        </div>
      </div>
    </main>
  );
}

function Dashboard({ user, setUser, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");

    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login", { replace: true });
    } catch (err) {
      setLogoutError(
        "Sign-out failed. Please try again before leaving this page.",
      );
    }
  }

  const dashboardInfo = {
    admin: {
      title: "Admin Dashboard",
      description: "Manage your application and its users.",
    },
    manager: {
      title: "Manager Dashboard",
      description: "View and manage your team's workspace.",
    },
    user: {
      title: "User Dashboard",
      description: "Welcome to your personal workspace.",
    },
  };

  const info = dashboardInfo[role];
  const justLoggedIn = location.state?.justLoggedIn;

  return (
    <div className="dashboard-page">
      <nav className="navbar bg-white border-bottom px-3 px-md-5 py-3">
        <span className="navbar-brand fw-bold mb-0">Role Login App</span>

        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Sign Out
        </button>
      </nav>

      <main className="container py-5">
        {justLoggedIn && (
          <div className="alert alert-success" role="status">
            Login successful. Welcome, {user.name}!
          </div>
        )}

        {logoutError && (
          <div className="alert alert-danger" role="alert">
            {logoutError}
          </div>
        )}

        <section className="identity-banner mb-4">
          <div>
            <p className="text-secondary small mb-1">Signed in as</p>
            <h2 className="h4 fw-bold mb-1">{user.name}</h2>
            <p className="mb-0">{user.email}</p>
          </div>

          <span className="badge text-bg-primary role-badge">
            {user.role.toUpperCase()}
          </span>
        </section>

        <section className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 fw-bold">{info.title}</h1>
            <p className="text-secondary mb-4">{info.description}</p>

            {role === "admin" && (
              <div className="alert alert-primary mb-0">
                Admin workspace: add user management, reports and application
                settings here.
              </div>
            )}

            {role === "manager" && (
              <div className="alert alert-info mb-0">
                Manager workspace: add team management and progress reports
                here.
              </div>
            )}

            {role === "user" && (
              <div className="alert alert-success mb-0">
                User workspace: add your profile and personal tasks here.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProtectedDashboard({ user, setUser, requiredRole }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Prevent a user from opening another role's dashboard in the UI.
  if (user.role !== requiredRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Dashboard user={user} setUser={setUser} role={requiredRole} />;
}

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const response = await api.get("/auth/me");
        if (active) setUser(response.data.user);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  if (checkingSession) {
    return (
      <div className="loading-page">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={getDashboardPath(user.role)} replace />
          ) : (
            <LoginPage setUser={setUser} />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedDashboard
            user={user}
            setUser={setUser}
            requiredRole="admin"
          />
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedDashboard
            user={user}
            setUser={setUser}
            requiredRole="manager"
          />
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedDashboard
            user={user}
            setUser={setUser}
            requiredRole="user"
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={user ? getDashboardPath(user.role) : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
