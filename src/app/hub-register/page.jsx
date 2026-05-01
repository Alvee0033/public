"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { instance } from "@/lib/axios";
import StepIndicator from "./_components/StepIndicator";
import StepHubProfile from "./_components/StepHubProfile";
import StepHubLocation from "./_components/StepHubLocation";
import StepHubDocuments from "./_components/StepHubDocuments";

export default function HubRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [hubId, setHubId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      setAuthChecked(true);
      setIsAuthorized(false);
      return;
    }

    // Use stored user first (avoids an extra round-trip)
    const stored = localStorage.getItem("user");
    const checkUser = (user) => {
      if (!user) return false;
      // API returns role as a single string: "LearningHub Marketplace Partner"
      const role = String(user.role ?? user.primaryRole?.name ?? "").toLowerCase();
      // Also handle roles array for future-proofing
      const rolesArr = (user.roles ?? []).map((r) =>
        typeof r === "string" ? r.toLowerCase() : String(r?.name ?? "").toLowerCase()
      );
      return (
        role.includes("partner") ||
        role.includes("admin") ||
        rolesArr.some((r) => r.includes("partner")) ||
        rolesArr.some((r) => r.includes("admin"))
      );
    };

    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (checkUser(user)) {
          setIsAuthorized(true);
          setAuthChecked(true);
          return;
        }
      } catch {
        // fall through to API call
      }
    }

    // Fallback: verify with API (POST /auth/me)
    instance
      .post("/auth/me")
      .then((res) => {
        const user = res?.data ?? {};
        setIsAuthorized(checkUser(user));
      })
      .catch(() => {
        setIsAuthorized(false);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  const handleProfileNext = (data) => {
    setProfileData(data);
    setStep(2);
  };

  const handleLocationNext = async (data) => {
    setLocationData(data);
    setSubmitting(true);
    try {
      const payload = { ...profileData, ...data };
      const toFiniteNumber = (value) => {
        if (value === "" || value === undefined || value === null) return undefined;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Number(parsed.toFixed(7)) : undefined;
      };

      // Coerce / strip numeric FK fields — never send 0 or "" as an ID
      const toId = (v) => { const n = Number(v); return n > 0 ? n : undefined; };
      payload.master_country_id = toId(payload.master_country_id);
      payload.master_state_id   = toId(payload.master_state_id);
      // master_city_id is never sent — city is stored as plain text
      delete payload.master_city_id;
      // Remove undefined FK fields entirely so they don't reach the backend
      if (!payload.master_country_id) delete payload.master_country_id;
      if (!payload.master_state_id)   delete payload.master_state_id;
      // City as plain text — remove if blank
      if (!payload.city) delete payload.city;
      // Coordinates
      payload.latitude = toFiniteNumber(payload.latitude);
      payload.longitude = toFiniteNumber(payload.longitude);
      if (payload.latitude === undefined) delete payload.latitude;
      if (payload.longitude === undefined) delete payload.longitude;
      // Strip empty strings
      if (!payload.website_url) delete payload.website_url;

      const res = await instance.post("/learning-hub", payload);
      const created = res?.data?.data ?? res?.data;
      setHubId(created?.id ?? null);
      toast.success("Hub registered successfully! Please upload your documents.");
      setStep(3);
    } catch (err) {
      const status = err?.response?.status;

      // 409 = hub with this name already exists for this operator.
      // Fetch their existing pending hub and continue to the documents step.
      if (status === 409) {
        try {
          const myHubs = await instance.get("/learning-hub/my-hubs");
          const hubs = myHubs?.data?.data ?? myHubs?.data ?? [];
          const hubName = profileData?.hub_name ?? "";
          const existing =
            hubs.find((h) =>
              (h.hub_name ?? "").toLowerCase() === hubName.toLowerCase()
            ) ?? hubs[0];

          if (existing?.id) {
            setHubId(existing.id);
            toast.info("A hub with this name already exists — continuing to documents.");
            setStep(3);
            return;
          }
        } catch {
          // fall through to generic error
        }
        toast.error(
          err?.response?.data?.message ??
            "A hub with this name already exists. Check your dashboard."
        );
        return;
      }

      toast.error(
        err?.response?.data?.message ?? "Failed to register hub. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = () => {
    router.push("/lms/hub-dashboard");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Partner Account Required</h2>
          <p className="text-gray-500 text-sm mb-6">
            You need a <strong>LearningHub Marketplace Partner</strong> account to register a hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Create Partner Account
            </Link>
            <Link
              href="/login"
              className="inline-block border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = {
    1: "Tell us about your hub",
    2: "Where is your hub located?",
    3: "Upload verification documents",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Hub Registration
          </span>
          <h1 className="text-2xl font-bold text-gray-900">{stepTitles[step]}</h1>
          <p className="text-gray-500 text-sm mt-1">Step {step} of 3</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <StepIndicator currentStep={step} />

          {step === 1 && (
            <StepHubProfile
              initialData={profileData}
              onNext={handleProfileNext}
            />
          )}
          {step === 2 && (
            <StepHubLocation
              initialData={locationData}
              onNext={handleLocationNext}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepHubDocuments
              hubId={hubId}
              onComplete={handleComplete}
              onBack={() => setStep(2)}
            />
          )}

          {submitting && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already registered a hub?{" "}
          <Link href="/lms/hub-dashboard" className="text-green-600 hover:underline">
            Go to your hub dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
