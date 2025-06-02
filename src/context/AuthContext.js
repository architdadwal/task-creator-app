"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check
  const router = useRouter();

  // Mock user storage in localStorage
  const getUsersFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const users = localStorage.getItem("taskAppUsers");
      return users ? JSON.parse(users) : [];
    }
    return [];
  };

  const saveUsersToLocalStorage = (users) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("taskAppUsers", JSON.stringify(users));
    }
  };

  const getLoggedInUserFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("loggedInTaskAppUser");
    }
    return null;
  };

  const setLoggedInUserInLocalStorage = (email) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("loggedInTaskAppUser", email);
    }
  };

  const removeLoggedInUserFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("loggedInTaskAppUser");
    }
  };

  useEffect(() => {
    // Check if a user is already logged in (e.g., from a previous session)
    const loggedInUserEmail = getLoggedInUserFromLocalStorage();
    if (loggedInUserEmail) {
      const users = getUsersFromLocalStorage();
      const userExists = users.find((user) => user.email === loggedInUserEmail);
      if (userExists) {
        setCurrentUser({ email: loggedInUserEmail });
      } else {
        // If user in localStorage doesn't exist in users list (e.g. users cleared), log them out
        removeLoggedInUserFromLocalStorage();
      }
    }
    setLoading(false);
  }, []);

  const signup = (email, password) => {
    return new Promise((resolve, reject) => {
      const users = getUsersFromLocalStorage();
      if (users.find((user) => user.email === email)) {
        reject(new Error("User already exists with this email."));
        return;
      }
      // In a real app, HASH THE PASSWORD before saving!
      users.push({ email, password /* NEVER store plain text passwords */ });
      saveUsersToLocalStorage(users);
      console.log("User signed up:", { email });
      resolve({ email });
    });
  };

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      const users = getUsersFromLocalStorage();
      const user = users.find((user) => user.email === email);

      // In a real app, compare hashed passwords!
      if (user && user.password === password) {
        setCurrentUser({ email });
        setLoggedInUserInLocalStorage(email);
        console.log("User logged in:", { email });
        resolve({ email });
      } else {
        reject(new Error("Invalid email or password."));
      }
    });
  };

  const logout = () => {
    setCurrentUser(null);
    removeLoggedInUserFromLocalStorage();
    console.log("User logged out");
    router.push("/login"); // Redirect to login after logout
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
