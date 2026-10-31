
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api.js";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login", {
        state: { message: "Account created! Please log in." },
      });
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
        <p className="eyebrow">WELCOME TO NESTORA</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Join Nestora to discover or list properties.
        </p>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          autoComplete="name"
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          minLength={8}
          required
          autoComplete="new-password"
        />

        <button className="primary-btn auth-submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
