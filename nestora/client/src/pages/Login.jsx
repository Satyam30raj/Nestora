
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("nestoraToken", data.token);
      localStorage.setItem("nestoraUser", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Link to="/" className="logo">
        nestora<span>.</span>
      </Link>

      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in to Nestora</h1>
        <p className="auth-subtitle">
          Find your next space or manage your listings.
        </p>

        {location.state?.message && (
          <p className="success-message">{location.state.message}</p>
        )}

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
          required
          autoComplete="current-password"
        />

        <button className="primary-btn auth-submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
