"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/lib/types";
import TaskRow from "@/components/TaskRow";
import TaskDetailModal from "@/components/TaskDetailModal";

export default function UserPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [inputUser, setInputUser] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", username),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }));
      setTasks(data);
      setLoading(false);
    });
    return () => unsub();
  }, [username]);

  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]);

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
  };

  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  // Login screen
  if (!username) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        background: "var(--cream)",
        position: "relative", zIndex: 1,
      }}>
        {/* Left panel - decorative */}
        <div style={{
          width: "42%", background: "var(--ink)",
          display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "60px 56px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: -80, right: -80,
            width: 300, height: 300, borderRadius: "50%",
            border: "1px solid rgba(196,99,58,0.2)",
          }} />
          <div style={{
            position: "absolute", bottom: -20, right: -20,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(196,99,58,0.1)",
          }} />
          <div style={{
            position: "absolute", top: 60, right: 60,
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--clay)",
          }} />
          <div style={{
            position: "absolute", top: 120, right: 40,
            width: 3, height: 3, borderRadius: "50%",
            background: "rgba(196,99,58,0.5)",
          }} />

          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 48, height: 48, borderRadius: 12,
              background: "var(--clay)", marginBottom: 32,
            }}>
              <span style={{ color: "#fff", fontSize: 22, fontFamily: "Playfair Display, serif", fontWeight: 700 }}>T</span>
            </div>

            <h1 style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 36, fontWeight: 700, color: "#faf7f2",
              lineHeight: 1.25, marginBottom: 16,
            }}>
              Your work,<br />beautifully tracked.
            </h1>
            <p style={{ fontSize: 15, color: "rgba(250,247,242,0.5)", lineHeight: 1.7 }}>
              Sign in to view tasks assigned to you and keep your team updated on progress.
            </p>

            <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "◈", text: "Real-time task updates" },
                { icon: "◎", text: "Track your progress" },
                { icon: "◉", text: "Mark tasks complete" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "var(--clay)", fontSize: 14 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "rgba(250,247,242,0.5)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          justifyContent: "center", padding: "40px",
        }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 28, fontWeight: 700, color: "var(--ink)",
                marginBottom: 8,
              }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                Enter your username to access your tasks
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600,
                color: "var(--ink2)", marginBottom: 8,
              }}>
                Username
              </label>
              <input
                style={{
                  width: "100%",
                  background: "var(--white)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 12, padding: "13px 16px",
                  fontSize: 15, color: "var(--ink)",
                  fontFamily: "DM Sans, sans-serif", outline: "none",
                  boxShadow: "var(--shadow)",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && inputUser.trim() && setUsername(inputUser.trim())}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--clay)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,99,58,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
              />
            </div>

            <button
              onClick={() => inputUser.trim() && setUsername(inputUser.trim())}
              style={{
                width: "100%", padding: "14px",
                background: "var(--clay)", border: "none",
                borderRadius: 12, color: "#fff",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600, fontSize: 15, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(196,99,58,0.35)",
                transition: "background 0.15s, transform 0.1s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--clay-dark)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "var(--clay)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View My Tasks →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Task list view
  const completionRate = tasks.length > 0 ? Math.round((counts.Completed / tasks.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", position: "relative", zIndex: 1 }}>
      {/* Header */}
      <header style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{
          maxWidth: 860, margin: "0 auto", padding: "0 32px",
          height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--clay)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 15, fontFamily: "Playfair Display, serif",
              fontWeight: 700, color: "#fff",
            }}>T</div>
            <div>
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
                Terrainfra360
              </span>
              <span style={{
                marginLeft: 8, fontSize: 10, color: "var(--muted)",
                background: "var(--paper)", border: "1px solid var(--border)",
                padding: "2px 7px", borderRadius: 20, letterSpacing: "0.5px",
              }}>USER</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{username}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{completionRate}% complete</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--clay-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "var(--clay-dark)",
              fontFamily: "Playfair Display, serif",
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => { setUsername(""); setTasks([]); setInputUser(""); setFilter("All"); }}
              style={{
                padding: "6px 14px", background: "var(--paper)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 12, color: "var(--muted)", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "36px 32px" }}>
        {/* Progress bar section */}
        <div style={{
          background: "var(--white)", borderRadius: 16,
          border: "1px solid var(--border)", padding: "24px 28px",
          marginBottom: 28, boxShadow: "var(--shadow)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>
                Hello, {username} 👋
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                You have {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned
              </p>
            </div>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: "var(--clay)" }}>
              {completionRate}%
            </span>
          </div>
          <div style={{ height: 8, background: "var(--paper)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              background: `linear-gradient(90deg, var(--clay), var(--sage))`,
              width: `${completionRate}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
            {[
              { label: "Pending", count: counts.Pending, color: "#d4820a" },
              { label: "In Progress", count: counts["In Progress"], color: "#c4633a" },
              { label: "Completed", count: counts.Completed, color: "#5a7a5e" },
            ].map((s) => (
              <span key={s.label} style={{ fontSize: 12, color: "var(--muted)" }}>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.count}</span> {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["All", "Pending", "In Progress", "Completed"].map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 16px", borderRadius: 8,
                  border: `1px solid ${active ? "var(--clay)" : "var(--border)"}`,
                  background: active ? "var(--clay-light)" : "var(--white)",
                  color: active ? "var(--clay-dark)" : "var(--muted)",
                  fontFamily: "DM Sans, sans-serif", fontWeight: active ? 600 : 400,
                  fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {f} <span style={{ opacity: 0.7 }}>({counts[f as keyof typeof counts]})</span>
              </button>
            );
          })}
        </div>

        {/* Task list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
            Loading your tasks...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px",
            background: "var(--white)", borderRadius: 16,
            border: "1px solid var(--border)", color: "var(--muted)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📭</div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "var(--ink2)", marginBottom: 6 }}>
              Nothing here
            </div>
            <div style={{ fontSize: 13 }}>
              {filter === "All" ? "No tasks assigned to you yet" : `No ${filter} tasks`}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((task, i) => (
              <div key={task.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                <TaskRow task={task} onClick={() => setSelectedTask(task)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}