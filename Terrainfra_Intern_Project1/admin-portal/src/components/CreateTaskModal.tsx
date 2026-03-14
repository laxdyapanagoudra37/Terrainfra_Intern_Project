"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface Props { onClose: () => void; }

export default function CreateTaskModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch users from Firestore 'users' collection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const userList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return data.name || data.username || doc.id;
        });
        setUsers(userList);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        toast.error("Could not load users");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !assignedTo.trim()) {
      toast.error("Please fill in title and assignee");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        description: description.trim(),
        assignedTo: assignedTo.trim(),
        status: "Pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      toast.success("Task created!");
      onClose();
    } catch (err) {
      console.error("Firebase write error:", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--cream)",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: "var(--ink)",
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink2)",
    marginBottom: 6,
    letterSpacing: "0.2px",
  };

  const focusField = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--clay)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196,99,58,0.12)";
    e.currentTarget.style.background = "var(--white)";
  };
  const blurField = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "var(--cream)";
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(30,26,22,0.4)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: 24,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: 20, padding: "36px 36px 32px",
          width: "100%", maxWidth: 500,
          boxShadow: "var(--shadow-lg)",
          position: "relative",
        }}
        className="fade-up"
      >
        {/* Decorative corner */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 80, height: 80,
          background: "var(--clay-light)",
          borderRadius: "0 20px 0 80px",
          opacity: 0.5,
        }} />

        <div style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 24, fontWeight: 700,
            color: "var(--ink)", marginBottom: 4,
          }}>
            Create New Task
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>
            Assign a task to a team member
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Task Title — no placeholder */}
            <div>
              <label style={labelStyle}>Task Title *</label>
              <input
                style={fieldStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={focusField}
                onBlur={blurField}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...fieldStyle, minHeight: 100, resize: "vertical", lineHeight: 1.65 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about what needs to be done..."
                onFocus={focusField as any}
                onBlur={blurField as any}
              />
            </div>

            {/* Assign To — dropdown from Firestore users */}
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Assign To *</label>
              <div
                onClick={() => !usersLoading && setDropdownOpen(!dropdownOpen)}
                style={{
                  ...fieldStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: usersLoading ? "not-allowed" : "pointer",
                  userSelect: "none",
                  background: assignedTo ? "var(--white)" : "var(--cream)",
                  borderColor: dropdownOpen ? "var(--clay)" : "var(--border)",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(196,99,58,0.12)" : "none",
                }}
              >
                <span style={{ color: assignedTo ? "var(--ink)" : "var(--muted)" }}>
                  {usersLoading
                    ? "Loading users..."
                    : assignedTo || (users.length === 0 ? "No users found" : "Select a user")}
                </span>
                <span style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  display: "inline-block",
                }}>▼</span>
              </div>

              {/* Dropdown list */}
              {dropdownOpen && users.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0, right: 0,
                  background: "var(--white)",
                  border: "1.5px solid var(--clay)",
                  borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(30,26,22,0.12)",
                  zIndex: 200,
                  overflow: "hidden",
                  maxHeight: 200,
                  overflowY: "auto",
                }}>
                  {users.map((user) => (
                    <div
                      key={user}
                      onClick={() => {
                        setAssignedTo(user);
                        setDropdownOpen(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        fontSize: 14,
                        color: "var(--ink)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: assignedTo === user ? "var(--clay-light)" : "transparent",
                        transition: "background 0.1s",
                      }}
                      onMouseOver={(e) => {
                        if (assignedTo !== user)
                          e.currentTarget.style.background = "var(--cream)";
                      }}
                      onMouseOut={(e) => {
                        if (assignedTo !== user)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* Avatar circle */}
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "var(--clay-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                        color: "var(--clay-dark)",
                        fontFamily: "Playfair Display, serif",
                        flexShrink: 0,
                      }}>
                        {user.charAt(0).toUpperCase()}
                      </div>
                      <span>{user}</span>
                      {assignedTo === user && (
                        <span style={{ marginLeft: "auto", color: "var(--clay)", fontSize: 12 }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No users message */}
              {!usersLoading && users.length === 0 && (
                <p style={{ fontSize: 11, color: "var(--muted2)", marginTop: 5 }}>
                  No users found in Firestore. Add users to the 'users' collection first.
                </p>
              )}
              {users.length > 0 && (
                <p style={{ fontSize: 11, color: "var(--muted2)", marginTop: 5 }}>
                  User must enter this exact name in the User Portal
                </p>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "12px",
                  background: "var(--paper)", border: "1.5px solid var(--border)",
                  borderRadius: 10, color: "var(--muted)",
                  fontFamily: "DM Sans, sans-serif", fontWeight: 500,
                  fontSize: 14, cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--border2)")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 2, padding: "12px",
                  background: loading ? "var(--muted2)" : "var(--clay)",
                  border: "none", borderRadius: 10,
                  color: "#fff", fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  boxShadow: loading ? "none" : "0 4px 12px rgba(196,99,58,0.3)",
                }}
                onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = "var(--clay-dark)"; }}
                onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = "var(--clay)"; }}
              >
                {loading ? "Creating..." : "Create Task →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}