"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Adjust path if context is elsewhere
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      router.push("/login"); // Redirect to login page after successful signup
    } catch (err) {
      setError(err.message || "Failed to create an account. Please try again.");
    }
    setLoading(false);
  };

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    opacity: loading ? 0.7 : 1,
  };

  const errorStyle = {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
    fontSize: "14px",
  };

  const linkStyle = {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "15px",
  };

  return (
    <div style={pageStyle}>
      <div style={formStyle}>
        <h1
          style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}
        >
          Sign Up
        </h1>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div style={linkStyle}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
