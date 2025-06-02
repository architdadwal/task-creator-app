"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const getTasksFromLocalStorage = (userEmail) => {
    if (typeof window !== "undefined" && userEmail) {
      const storedTasks = localStorage.getItem(`tasks_${userEmail}`);
      return storedTasks ? JSON.parse(storedTasks) : [];
    }
    return [];
  };

  const saveTasksToLocalStorage = (userEmail, currentTasks) => {
    if (typeof window !== "undefined" && userEmail) {
      localStorage.setItem(`tasks_${userEmail}`, JSON.stringify(currentTasks));
    }
  };

  useEffect(() => {
    if (!authLoading) {
      // Only proceed if auth state is resolved
      if (!currentUser) {
        router.push("/login");
      } else {
        // Load tasks for the current user
        setTasks(getTasksFromLocalStorage(currentUser.email));
        setIsLoadingTasks(false);
      }
    }
  }, [currentUser, authLoading, router]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskText.trim() !== "" && currentUser) {
      const newTasks = [
        ...tasks,
        {
          id: Date.now(),
          text: taskText,
          dueDate: dueDate,
          completed: false,
        },
      ];
      setTasks(newTasks);
      saveTasksToLocalStorage(currentUser.email, newTasks);
      setTaskText("");
      setDueDate("");
    }
  };

  const toggleTaskCompletion = (taskId) => {
    if (currentUser) {
      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(currentUser.email, updatedTasks);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (currentUser) {
      const remainingTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(remainingTasks);
      saveTasksToLocalStorage(currentUser.email, remainingTasks);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString + "T00:00:00").toLocaleDateString(
      undefined,
      options
    );
  };

  // Styles (similar to previous, with additions for header)
  const pageContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
  };

  const headerStyle = {
    width: "100%",
    padding: "15px 30px",
    backgroundColor: "#34495e",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  };

  const appNameStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  const userInfoStyle = {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const logoutButtonStyle = {
    padding: "8px 15px",
    border: "none",
    backgroundColor: "#e74c3c",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const contentStyle = {
    maxWidth: "700px",
    width: "100%",
    margin: "30px auto",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  if (authLoading || isLoadingTasks || !currentUser) {
    // Show a loading state or a blank page while checking auth or redirecting
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <header style={headerStyle}>
        <span style={appNameStyle}>My Tasks</span>
        {currentUser && (
          <div style={userInfoStyle}>
            <span>Logged in as: {currentUser.email}</span>
            <button onClick={logout} style={logoutButtonStyle}>
              Logout
            </button>
          </div>
        )}
      </header>

      <div style={contentStyle}>
        <h1
          style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "30px",
          }}
        >
          Welcome, {currentUser.email}!
        </h1>

        <form
          onSubmit={handleAddTask}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task"
              style={{
                flexGrow: 1,
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "16px",
              }}
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "16px",
                minWidth: "150px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              border: "none",
              backgroundColor: "#3498db",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "17px",
              fontWeight: "bold",
            }}
          >
            Add Task
          </button>
        </form>

        {tasks.length === 0 && (
          <p
            style={{ textAlign: "center", color: "#7f8c8d", fontSize: "16px" }}
          >
            No tasks yet. Add some above!
          </p>
        )}

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                borderBottom: "1px solid #ecf0f1",
                backgroundColor: t.completed ? "#f9f9f9" : "#fff",
                borderRadius: "5px",
                marginBottom: "10px",
                boxShadow: t.completed ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTaskCompletion(t.id)}
                  style={{
                    marginRight: "15px",
                    cursor: "pointer",
                    transform: "scale(1.2)",
                  }}
                />
                <div>
                  <span
                    style={{
                      textDecoration: t.completed ? "line-through" : "none",
                      color: t.completed ? "#95a5a6" : "#34495e",
                      fontSize: "17px",
                      fontWeight: t.completed ? "normal" : "500",
                    }}
                  >
                    {t.text}
                  </span>
                  {t.dueDate && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#7f8c8d",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Due: {formatDate(t.dueDate)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(t.id)}
                style={{
                  marginLeft: "15px",
                  padding: "8px 12px",
                  border: "none",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
