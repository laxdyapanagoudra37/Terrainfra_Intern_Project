import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Terrainfra360 — My Tasks",
  description: "Task Management User Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1e1a16",
              border: "1px solid #e2d9cc",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(30,26,22,0.12)",
            },
            success: {
              iconTheme: { primary: "#5a7a5e", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#c4633a", secondary: "#ffffff" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
