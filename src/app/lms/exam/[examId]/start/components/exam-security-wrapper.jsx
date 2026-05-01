"use client";

export default function ExamSecurityWrapper({ children }) {
  return (
    <div
      className="min-h-screen bg-white"
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        // Prevent common dev tools shortcuts
        if (
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "J") ||
          (e.ctrlKey && e.key === "U")
        ) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
}
