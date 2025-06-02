"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const router = useRouter();

  if (currentUser && typeof window !== "undefined") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(
        err.message || "Failed to log in. Please check your credentials."
      );
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
    backgroundColor: "#007bff",
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
          Log In
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
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <div style={linkStyle}>
          Need an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#28a745", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
