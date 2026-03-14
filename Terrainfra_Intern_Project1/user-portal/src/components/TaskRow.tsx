"use client";

import { Task } from "@/lib/types";

const statusConfig: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  Pending: { color: "#d4820a", bg: "#fef9f0", border: "#f5d89a", dot: "#d4820a" },
  "In Progress": { color: "#c4633a", bg: "#fdf6f3", border: "#efc5b0", dot: "#c4633a" },
  Completed: { color: "#5a7a5e", bg: "#f4f9f4", border: "#aecdb2", dot: "#5a7a5e" },
};

interface Props { task: Task; onClick: () => void; }

export default function TaskRow({ task, onClick }: Props) {
  const s = statusConfig[task.status];
  const date = new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "18px 22px",
        display: "flex", alignItems: "center", gap: 16,
        cursor: "pointer", transition: "all 0.18s",
        boxShadow: "var(--shadow)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "var(--clay)";
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 12, height: 12, borderRadius: "50%",
        background: s.dot, flexShrink: 0,
        boxShadow: `0 0 0 3px ${s.bg}`,
        border: `1px solid ${s.border}`,
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "Playfair Display, serif",
          fontSize: 16, fontWeight: 600, color: "var(--ink)",
          marginBottom: 3, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {task.title}
        </div>
        {task.description && (
          <div style={{
            fontSize: 12, color: "var(--muted)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {task.description}
          </div>
        )}
      </div>

      {/* Badge */}
      <span style={{
        fontSize: 11, fontWeight: 600, color: s.color,
        background: s.bg, border: `1px solid ${s.border}`,
        padding: "4px 12px", borderRadius: 20, flexShrink: 0,
      }}>
        {task.status}
      </span>

      <span style={{ fontSize: 12, color: "var(--muted2)", flexShrink: 0, minWidth: 48 }}>
        {date}
      </span>

      {/* Arrow */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "var(--paper)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: "var(--muted)", flexShrink: 0,
        transition: "background 0.15s",
      }}>
        →
      </div>
    </div>
  );
}
