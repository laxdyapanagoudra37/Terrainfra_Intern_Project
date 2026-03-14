"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task, TaskStatus } from "@/lib/types";
import toast from "react-hot-toast";

interface Props { task: Task; onClose: () => void; }

const allStatuses: TaskStatus[] = ["Pending", "In Progress", "Completed"];

const statusConfig: Record<string, { color: string; bg: string; border: string; text: string }> = {
  Pending: { color: "#d4820a", bg: "#fde9c2", border: "#f5cc7a", text: "Mark as Pending" },
  "In Progress": { color: "#c4633a", bg: "#f0d5c8", border: "#e6b09a", text: "Start Working" },
  Completed: { color: "#5a7a5e", bg: "#d4e4d6", border: "#9ec5a2", text: "Mark Complete" },
};

export default function TaskDetailModal({ task, onClose }: Props) {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: TaskStatus) => {
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "tasks", task.id), { status: newStatus, updatedAt: Date.now() });
      setCurrentStatus(newStatus);
      toast.success(`Moved to "${newStatus}"`);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const s = statusConfig[currentStatus];
  const createdAt = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(30,26,22,0.4)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 24,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--white)", borderRadius: 20,
        width: "100%", maxWidth: 520,
        boxShadow: "var(--shadow-lg)", overflow: "hidden",
      }}
        className="fade-up"
      >
        {/* Colored top banner */}
        <div style={{
          background: s.bg, borderBottom: `1px solid ${s.border}`,
          padding: "24px 28px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{
                fontSize: 11, fontWeight: 600, color: s.color,
                background: "rgba(255,255,255,0.6)",
                border: `1px solid ${s.border}`,
                padding: "3px 10px", borderRadius: 20,
                display: "inline-block", marginBottom: 10,
              }}>
                {currentStatus}
              </span>
              <h2 style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 22, fontWeight: 700,
                color: "var(--ink)", lineHeight: 1.3,
                maxWidth: 360,
              }}>
                {task.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.6)", border: `1px solid ${s.border}`,
                color: s.color, fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>
          {/* Description */}
          {task.description && (
            <div style={{
              background: "var(--cream)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "14px 16px", marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>
                Description
              </div>
              <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7 }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Meta row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div style={{
              flex: 1, background: "var(--paper)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 4, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Assigned To</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{task.assignedTo}</div>
            </div>
            <div style={{
              flex: 1, background: "var(--paper)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, color: "var(--muted2)", marginBottom: 4, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Created</div>
              <div style={{ fontSize: 13, color: "var(--ink)" }}>{createdAt}</div>
            </div>
          </div>

          {/* Status selector only — no Mark as Completed button */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", marginBottom: 10 }}>
              Update Status
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {allStatuses.map((st) => {
                const c = statusConfig[st];
                const active = currentStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => updateStatus(st)}
                    disabled={loading}
                    style={{
                      flex: 1, padding: "10px 8px",
                      borderRadius: 10,
                      border: `1.5px solid ${active ? c.color : "var(--border)"}`,
                      background: active ? c.bg : "var(--white)",
                      color: active ? c.color : "var(--muted)",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 12, fontWeight: active ? 600 : 400,
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseOver={(e) => { if (!active && !loading) e.currentTarget.style.borderColor = c.color + "80"; }}
                    onMouseOut={(e) => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    {st}{active ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}