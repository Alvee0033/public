import { cn } from "@/lib/utils";

/* 
type = success,  error, warn, info

*/
export default function StatusBadge({ type, children, value }) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium",
        type === "success"
          ? "bg-green-100 text-green-600"
          : type === "error"
          ? "bg-red-100 text-rose-500"
          : type === "warn"
          ? "bg-yellow-100 text-yellow-600"
          : type === "info"
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-100 text-gray-600"
      )}
    >
      {children || value}
    </div>
  );
}
