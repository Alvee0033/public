"use client";

import navbarlogo from "@/assets/icons/navbarlogo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { instance } from "@/lib/axios";
import { getDashboardRoute } from "@/lib/dashboard-route";
import { setToken, setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  BookOpen,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

const ROLES = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    color: "blue",
    match: (r) => r.includes("student"),
    dashboard: "/lms/student-dashboard",
  },
  {
    id: "tutor",
    label: "Tutor",
    icon: BookOpen,
    color: "purple",
    match: (r) => r.includes("tutor"),
    dashboard: "/lms/tutor-dashboard",
  },
  {
    id: "guardian",
    label: "Guardian",
    icon: Users,
    color: "teal",
    match: (r) => r.includes("guardian"),
    dashboard: "/lms/guardian-dashboard",
  },
  {
    id: "hub",
    label: "Hub Partner",
    icon: Building2,
    color: "green",
    match: (r) => r.includes("partner") || r.includes("hub"),
    dashboard: "/lms/hub-dashboard",
  },
];

const COLOR_MAP = {
  blue:   { border: "border-blue-500",   bg: "bg-blue-50",   icon: "text-blue-600",   ring: "ring-blue-300"   },
  purple: { border: "border-purple-500", bg: "bg-purple-50", icon: "text-purple-600", ring: "ring-purple-300" },
  teal:   { border: "border-teal-500",   bg: "bg-teal-50",   icon: "text-teal-600",   ring: "ring-teal-300"   },
  green:  { border: "border-green-500",  bg: "bg-green-50",  icon: "text-green-600",  ring: "ring-green-300"  },
};

function LoginPage() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const response = await instance.post(
        "/auth/login",
        { email, password },
        { skipErrorLog: true },
      );
      const { access_token, user } = response.data?.data || {};

      if (!access_token || !user) {
        setError(response.data?.message || "Login failed. Unexpected response.");
        return;
      }

      localStorage.setItem("auth-token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      dispatch(setToken(access_token));

      toast.success("Signed in successfully!");

      const redirect =
        params.get("redirect") ||
        getDashboardRoute(user, { adminRoute: "/" });
      window.location.href = redirect;
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 401) setError(msg || "Invalid email or password.");
      else if (status === 404) setError(msg || "Account not found. Please register first.");
      else setError(msg || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src={navbarlogo} alt="ScholarPASS" width={180} height={46} className="h-11 w-auto" priority />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/90 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Role selector */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">I am a…</p>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map((role) => {
                  const c = COLOR_MAP[role.color];
                  const Icon = role.icon;
                  const active = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`
                        flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 px-1 transition-all
                        ${active 
                          ? `${c.border} ${c.bg} ring-2 ${c.ring} ring-offset-1` 
                          : "border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-white"}
                      `}
                    >
                      <Icon className={`w-5 h-5 ${active ? c.icon : "text-gray-400"}`} />
                      <span className={`text-[10px] font-bold leading-tight text-center ${active ? c.icon : "text-gray-500"}`}>
                        {role.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="bg-gray-50 h-11 border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="bg-gray-50 pr-11 h-11 border-gray-200 focus:bg-white transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:opacity-90 text-white font-bold text-sm mt-2 shadow-md transition-all active:scale-[0.98]"
              >
                {submitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Create an account
              </Link>
              <Link href="/forgot-password" title="Coming Soon" className="text-gray-400 cursor-not-allowed">
                Forgot password?
              </Link>
            </div>

          </div>
        </div>

        {/* Role hint */}
        {selectedRole && (() => {
          const role = ROLES.find((r) => r.id === selectedRole);
          const c = COLOR_MAP[role.color];
          return (
            <p className={`text-center text-xs mt-6 font-medium ${c.icon} animate-in fade-in slide-in-from-top-1`}>
              Signing in as <span className="font-bold">{role.label}</span> — redirecting to your dashboard.
            </p>
          );
        })()}

      </div>
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
