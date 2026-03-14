"use client";

import { Task } from "@/lib/types";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Pending: { label: "Pending", color: "#d4820a", bg: "#fde9c2", border: "#f5cc7a" },
  "In Progress": { label: "In Progress", color: "#c4633a", bg: "#f0d5c8", border: "#e6b09a" },
  Completed: { label: "Completed", color: "#5a7a5e", bg: "#d4e4d6", border: "#9ec5a2" },
};

export default function TaskCard({ task }: { task: Task }) {
  const s = statusConfig[task.status];
  const date = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const initials = task.assignedTo
    .split(".")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div style={{
      background: "var(--white)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      padding: "22px",
      boxShadow: "var(--shadow)",
      transition: "box-shadow 0.2s, transform 0.2s",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`,
      }} />

      {/* Status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.5px",
          color: s.color, background: s.bg,
          border: `1px solid ${s.border}`,
          padding: "3px 10px", borderRadius: 20,
        }}>
          {s.label}
        </span>
        <span style={{ fontSize: 11, color: "var(--muted2)" }}>{date}</span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "Playfair Display, serif",
        fontSize: 17, fontWeight: 600,
        color: "var(--ink)", lineHeight: 1.35,
        marginBottom: 10,
      }}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: 13, color: "var(--muted)", lineHeight: 1.65,
          marginBottom: 18,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {task.description}
        </p>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "0 0 14px" }} />

      {/* Assignee */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "var(--clay-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "var(--clay-dark)",
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)" }}>{task.assignedTo}</div>
          <div style={{ fontSize: 10, color: "var(--muted2)" }}>Assignee</div>
        </div>
      </div>
    </div>
  );
}
