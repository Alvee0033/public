import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function validateEnvVars() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable. Please add it to your .env file or Vercel project settings."
    );
  }
}

export const logOut = async () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const generateSecurityStamp = () => {
  // Generate a unique identifier (e.g., a random UUID)
  return crypto.randomUUID(); // Modern browsers support this
};

export function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function truncateText(text, limit = 150) {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + "...";
}
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";
