"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import CreateTaskModal from "@/components/CreateTaskModal";

const statusConfig = {
  Pending: { color: "#d4820a", bg: "#fde9c2", dot: "#d4820a" },
  "In Progress": { color: "#c4633a", bg: "#f0d5c8", dot: "#c4633a" },
  Completed: { color: "#5a7a5e", bg: "#d4e4d6", dot: "#5a7a5e" },
};

export default function AdminPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loggedIn, setLoggedIn] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
  };

  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError("");
      setPasswordInput("");
    } else {
      setError("Incorrect password. Try 'admin123'");
    }
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--ink)", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(196,99,58,0.2)" }} />
        <div style={{ position: "absolute", bottom: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(196,99,58,0.1)" }} />
        <div style={{ position: "absolute", top: 60, left: 60, width: 6, height: 6, borderRadius: "50%", background: "var(--clay)" }} />

        <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "40px 36px",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 48, height: 48, borderRadius: 12,
              background: "var(--clay)", marginBottom: 24,
            }}>
              <span style={{ color: "#fff", fontSize: 22, fontFamily: "Playfair Display, serif", fontWeight: 700 }}>T</span>
            </div>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 700, color: "#faf7f2", marginBottom: 6 }}>
              Admin Portal
            </h2>
            <p style={{ fontSize: 13, color: "rgba(250,247,242,0.4)", marginBottom: 32 }}>
              Enter your password to continue
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(250,247,242,0.4)", marginBottom: 8, letterSpacing: "1px", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${error ? "#c4633a" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: 10, fontSize: 14,
                  color: "#faf7f2", fontFamily: "DM Sans, sans-serif",
                  outline: "none",
                }}
              />
              {error && <p style={{ fontSize: 11, color: "#c4633a", marginTop: 6 }}>{error}</p>}
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: "100%", padding: "13px",
                background: "var(--clay)", border: "none",
                borderRadius: 10, color: "#fff",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--clay-dark)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "var(--clay)")}
            >
              Login →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", position: "relative", zIndex: 1 }}>

      {/* Sidebar */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 260,
        background: "var(--ink)", zIndex: 40,
        display: "flex", flexDirection: "column",
        padding: "32px 0",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 28px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, borderRadius: 10,
            background: "var(--clay)", marginBottom: 14,
          }}>
            <span style={{ color: "#fff", fontSize: 18, fontFamily: "Playfair Display, serif", fontWeight: 700 }}>T</span>
          </div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 17, fontWeight: 600, color: "#faf7f2", lineHeight: 1.2 }}>
            Terrainfra360
          </div>
          <div style={{ fontSize: 11, color: "rgba(250,247,242,0.4)", marginTop: 2, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Admin Portal
          </div>
        </div>

        {/* Stats in sidebar */}
        <div style={{ padding: "24px 20px", flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "1.5px", color: "rgba(250,247,242,0.35)", marginBottom: 12, textTransform: "uppercase", padding: "0 8px" }}>
            Overview
          </div>
          {[
            { label: "All Tasks", key: "All", icon: "◈" },
            { label: "Pending", key: "Pending", icon: "◷" },
            { label: "In Progress", key: "In Progress", icon: "◎" },
            { label: "Completed", key: "Completed", icon: "◉" },
          ].map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: 10, padding: "10px 12px", borderRadius: 8,
                  border: "none", cursor: "pointer",
                  background: active ? "rgba(196,99,58,0.18)" : "transparent",
                  color: active ? "var(--clay-light)" : "rgba(250,247,242,0.55)",
                  marginBottom: 2, transition: "all 0.15s",
                  textAlign: "left",
                }}
                onMouseOver={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{item.label}</span>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  background: active ? "rgba(196,99,58,0.3)" : "rgba(255,255,255,0.08)",
                  color: active ? "var(--clay-light)" : "rgba(250,247,242,0.4)",
                  padding: "1px 8px", borderRadius: 20,
                }}>
                  {counts[item.key as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Create button at bottom of sidebar */}
        <div style={{ padding: "0 20px 12px" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "100%", padding: "12px 16px",
              background: "var(--clay)",
              border: "none", borderRadius: 10,
              color: "#fff", fontFamily: "DM Sans, sans-serif",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--clay-dark)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "var(--clay)")}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            New Task
          </button>
        </div>

        {/* Logout button */}
        <div style={{ padding: "0 20px 20px" }}>
          <button
            onClick={() => setLoggedIn(false)}
            style={{
              width: "100%", padding: "10px 16px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
              color: "rgba(250,247,242,0.45)", fontFamily: "DM Sans, sans-serif",
              fontWeight: 500, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(196,99,58,0.12)";
              e.currentTarget.style.borderColor = "rgba(196,99,58,0.3)";
              e.currentTarget.style.color = "var(--clay-light)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(250,247,242,0.45)";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 260, minHeight: "100vh" }}>
        {/* Top bar */}
        <header style={{
          height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", background: "var(--white)",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>
              {filter === "All" ? "All Tasks" : filter}
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {filtered.length} task{filtered.length !== 1 ? "s" : ""} {filter !== "All" ? `— ${filter}` : "total"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--clay-light)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "var(--clay-dark)",
              fontFamily: "Playfair Display, serif",
            }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Admin</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Administrator</div>
            </div>
          </div>
        </header>

        {/* Stat cards */}
        <div style={{ padding: "32px 40px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 36 }}>
            {[
              { label: "Pending", count: counts["Pending"], color: "#d4820a", bg: "#fef9f0", border: "#f5d89a" },
              { label: "In Progress", count: counts["In Progress"], color: "#c4633a", bg: "#fdf4f0", border: "#efc5b0" },
              { label: "Completed", count: counts["Completed"], color: "#5a7a5e", bg: "#f0f6f1", border: "#aecdb2" },
            ].map((s) => (
              <div key={s.label} style={{
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 14, padding: "22px 24px",
                boxShadow: "var(--shadow)",
              }}>
                <div style={{ fontSize: 38, fontFamily: "Playfair Display, serif", fontWeight: 700, color: s.color, lineHeight: 1 }}>
                  {s.count}
                </div>
                <div style={{ fontSize: 13, color: s.color, marginTop: 6, fontWeight: 500, opacity: 0.8 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tasks */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
              Loading tasks...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 0",
              background: "var(--white)", borderRadius: 16,
              border: "1px solid var(--border)", color: "var(--muted)",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📋</div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, color: "var(--ink2)", marginBottom: 8 }}>
                No tasks here
              </div>
              <div style={{ fontSize: 13 }}>
                {filter === "All" ? "Click 'New Task' to get started" : `No ${filter} tasks at the moment`}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18, paddingBottom: 40 }}>
              {filtered.map((task, i) => (
                <div key={task.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && <CreateTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}