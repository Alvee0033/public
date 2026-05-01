"use client";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

// Capitalize helper
const capitalizeWords = (str) =>
  str
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export default function TutorNameServer({ children }) {
  const [tutorName, setTutorName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchTutorName() {
      try {
        // Get tutor ID from Redux state
        const tutorId = user?.tutor_id;
        if (!tutorId) return;

        const tutorRes = await axios.get("/tutors?limit=10000");
        const tutors = Array.isArray(tutorRes.data?.data) ? tutorRes.data.data : [];
        const foundTutor = tutors.find((t) => t.id === tutorId);

        if (foundTutor?.name) {
          setTutorName(capitalizeWords(foundTutor.name));
        }
      } catch (e) {
        console.error("TutorNameServer error:", e);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchTutorName();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Loader2 className="animate-spin w-6 h-6 text-gray-500" />;
  }

  if (!tutorName) {
    return <span>Unknown tutor</span>; // optional fallback
  }

  return (
    <>
      {tutorName}
      {children && `'s ${children}`}
    </>
  );
}
