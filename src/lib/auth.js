import { setToken, setUser } from "@/redux/features/authSlice";
import { toast } from "sonner";
import { instance } from "./axios";

/**
 * Register a new user via EOS26Core POST /auth/register
 * EOS26Core expects: { email, password, first_name, last_name, username }
 */
export const registerUser = async (values) => {
  try {
    const response = await instance.post("/auth/register", values);
    toast.success("Registration successful! Please log in.");
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error("Email already exists. Please use a different email.");
    } else {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
    throw error;
  }
};

/**
 * Login via EOS26Core POST /auth/login
 * EOS26Core returns: { success, data: { access_token, token_type, expires_in, user } }
 */
export const loginUser = async (email, password, dispatch) => {
  try {
    const response = await instance.post("/auth/login", { email, password });
    const { access_token, user } = response.data?.data || {};

    if (access_token && user) {
      localStorage.setItem("auth-token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      if (dispatch) {
        dispatch(setToken(access_token));
        dispatch(setUser(user));
      }
    }

    toast.success("Login successful!");
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Login failed. Please try again.";
    toast.error(msg);
    throw error;
  }
};

/**
 * Logout via EOS26Core POST /auth/logout
 */
export const logoutUser = async (dispatch) => {
  try {
    await instance.post("/auth/logout");
  } catch (_) {
    // proceed with local cleanup even if the server call fails
  } finally {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    if (dispatch) {
      dispatch(setToken(null));
      dispatch(setUser(null));
    }
  }
};

/**
 * Fetch current authenticated user via EOS26Core POST /auth/me
 * The token is attached automatically by the axios request interceptor.
 */
export const getCurrentUser = async () => {
  const response = await instance.post("/auth/me");
  return response.data?.data;
};

// ─── OTP helpers (not yet available in EOS26Core — kept as stubs) ─────────────

export const verifyEmail = async (_email, _otp) => {
  toast.error("Email verification is not yet available.");
  throw new Error("Not implemented");
};

export const resendVerificationOTP = async (_email) => {
  toast.error("Resend OTP is not yet available.");
  throw new Error("Not implemented");
};

export const requestLoginOTP = async (_email) => {
  toast.error("OTP login is not yet available.");
  throw new Error("Not implemented");
};

export const verifyLoginOTP = async (_email, _otp, _dispatch) => {
  toast.error("OTP verification is not yet available.");
  throw new Error("Not implemented");
};
