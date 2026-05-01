"use client";

import Button from "@/components/shared/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import {
  AlertCircle,
  Briefcase,
  Loader2,
  Mail,
  Phone,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function TutorsPage() {
  // Get user data from Redux state instead of /me API
  const userData = useAppSelector((state) => state.auth.user);

  // Get student ID from user data
  const studentId = userData?.student_id;

  // Fetch tutors for the student using /tutor-students?filter={"student":studentId}&pagination=true
  const getTutors = async () => {
    if (!studentId) return [];
    try {
      const params = new URLSearchParams({
        filter: JSON.stringify({ student: studentId }),
        pagination: "true",
      });

      const url = `/tutor-students?${params.toString()}`;

      // axios instance already attaches Authorization header via interceptor
      const res = await axios.get(url);
      const list = res?.data?.data || [];

      // Map response to a simple tutor list suitable for UI
      const tutors = list.map((item) => {
        const t = item.tutor || {};
        return {
          id: t.id ?? item.tutor_id ?? item.id,
          name: t.name ?? `${t.first_name || ""} ${t.last_name || ""}`.trim(),
          first_name: t.first_name,
          last_name: t.last_name,
          profile_picture_url: t.profile_picture || null,
          mobile: t.mobile || null,
          personal_email: t.personal_email || null,
          years_of_experience: t.years_of_experience || null,
          raw: item,
        };
      });

      return tutors;
    } catch (err) {
      console.error("Error fetching tutors:", err);
      throw err;
    }
  };

  const {
    data: tutors = [],
    isLoading: tutorsLoading,
    error: tutorsError,
  } = useSWR(studentId ? ["tutor-students", studentId] : null, getTutors);

  // Format date function for displaying dates
  const formatDate = (date) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Tutors</h1>
            <p className="text-muted-foreground">
              View and manage tutors associated with your student account.
            </p>
          </div>
          {/* <Link href="/lms/student-dashboard/my-tutors/new">
            <Button className="rounded-md border-none">
              <Plus className="mr-2 h-4 w-4" /> Add Tutor
            </Button>
          </Link> */}
        </div>

        {/* Tutors List Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Tutors
            </CardTitle>
            <CardDescription>
              List of tutors linked to this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tutorsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading tutors...</span>
              </div>
            ) : tutorsError ? (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Error loading tutors</span>
              </div>
            ) : tutors.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No tutors found for this student.
                {/* <div className="mt-4">
                  <Link href="/lms/student-dashboard/my-tutors/new">
                    <Button className="rounded-md border-none">
                      <Plus className="mr-2 h-4 w-4" /> Add Tutor
                    </Button>
                  </Link>
                </div> */}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-white"
                  >
                    <Avatar className="h-12 w-12">
                      {tutor.profile_picture_url ? (
                        <AvatarImage
                          src={tutor.profile_picture_url}
                          alt={tutor.name || "Tutor"}
                        />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {tutor.name
                            ? tutor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "T"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{tutor.name || "Tutor"}</h3>
                      <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        {tutor.personal_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${tutor.personal_email}`}
                              className="hover:underline"
                            >
                              {tutor.personal_email}
                            </a>
                          </div>
                        )}
                        {tutor.mobile && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${tutor.mobile}`}
                              className="hover:underline"
                            >
                              {tutor.mobile}
                            </a>
                          </div>
                        )}
                        {tutor.years_of_experience && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {tutor.years_of_experience} yrs experience
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className="text-right">
                      <Link
                        href={`/lms/student-dashboard/my-tutors/${tutor.id}`}
                      >
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
