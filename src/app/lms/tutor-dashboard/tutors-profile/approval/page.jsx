"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import {
  BookOpen,
  CheckCircle,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Play,
  ShieldCheck,
  Twitter,
  User,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProfileEditModal from "../_components/ProfileEditModal";
import QualificationsSummaryEdit from "../_components/Qualifications&Summary";

export default function TutorProfileViewPage() {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expertiseCourses, setExpertiseCourses] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchTutorById() {
      try {
        // Get tutor ID from Redux state
        const tutorId = user?.tutor_id;
        if (!tutorId) throw new Error("Tutor ID not found");
        const tutorsRes = await axios.get("/tutors?limit=1000");
        const data = Array.isArray(tutorsRes.data.data)
          ? tutorsRes.data.data
          : [];
        const filtered = data.filter(
          (t) =>
            t.id === tutorId && t.verified_tutor === true && t.summary !== null
        );
        setTutor(filtered[0] || null);

        // Fetch expertise courses for this tutor
        const expertiseRes = await axios.get(
          "/tutor-course-expertise?limit=10000"
        );
        const expertiseData = Array.isArray(expertiseRes.data.data)
          ? expertiseRes.data.data
          : [];
        // Filter by tutor_id only (show all courses for this tutor)
        const filteredExpertise = expertiseData.filter(
          (e) => Number(e.tutor_id) === Number(tutorId)
        );
        setExpertiseCourses(filteredExpertise);
      } catch (e) {
        setError("Failed to load tutor");
      }
      setLoading(false);
    }
    if (user) {
      fetchTutorById();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fetch courses separately so page loads before courses arrive
  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesRes = await axios.get("/courses?limit=10000");
        const coursesData = Array.isArray(coursesRes.data.data)
          ? coursesRes.data.data
          : [];
        const map = {};
        coursesData.forEach((course) => {
          map[course.id] = course.name;
        });
        setCoursesMap(map);
      } catch (e) {
        // Optionally handle error
      }
      setCoursesLoading(false);
    }
    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
        {/* Skeleton Profile Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 mb-4 bg-gray-200 rounded-full" />
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-48 bg-gray-200 rounded" />
                  <div className="w-6 h-6 bg-green-100 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              </div>
              <div className="mt-4">
                <div className="h-20 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        {/* Skeleton Expertise & Video */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-60 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-60 bg-gray-200 rounded mb-2" />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
            <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
        </div>
        {/* Skeleton Social Media */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
          </div>
          <div className="mt-6 flex gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>
        {/* Skeleton Profile Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
          <div className="py-8 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-6 py-4">
              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center" />
              <div>
                <div className="h-6 w-32 bg-green-200 rounded mb-2" />
                <div className="h-4 w-48 bg-green-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!tutor)
    return <div className="p-8 text-center">No verified tutor found.</div>;

  const handleSave = (newData) => {
    // update tutor state with new data returned from API
    if (!newData) return;
    setTutor((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Section 1: Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <span className="flex items-center gap-2 text-purple-600">
            <User className="w-5 h-5" />
            <CardTitle>Profile Information</CardTitle>
          </span>

          <span className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage
                  src={
                    tutor.profile_picture ||
                    "/placeholder.svg?height=128&width=128"
                  }
                />
                <AvatarFallback className="text-2xl">
                  {tutor.first_name?.[0]}
                  {tutor.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">
                    {tutor.first_name} {tutor.last_name}
                  </h1>
                  {tutor.verified_tutor && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                {/* <p className="text-gray-600 mb-2">@{tutor.username}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{tutor.location || tutor.address || ""}</span>
                                </div> */}
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* <div>
                                    <span className="font-medium text-gray-600">First Name:</span>
                                    <p className="text-gray-900">{tutor.first_name}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Last Name:</span>
                                    <p className="text-gray-900">{tutor.last_name}</p>
                                </div> */}
                <div>
                  <span className="font-medium text-gray-600">Username:</span>
                  <p className="text-gray-900">{tutor.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900">{tutor.personal_email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <p className="text-gray-900">{tutor.mobile}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Years of Experience:
                  </span>
                  <p className="text-gray-900">
                    {tutor.years_of_experience} years
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium text-gray-600">Bio:</span>
                <div
                  className="text-gray-900 mt-1"
                  dangerouslySetInnerHTML={{ __html: tutor.full_profile }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileEditModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profileData={tutor}
        tutorId={tutor?.id}
        onSave={handleSave}
      />

      {/* Section 2: Subject Expertise and Video */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <BookOpen className="w-5 h-5" />
              Subject Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Expertise in course</h4>
              <div className="flex flex-wrap gap-2">
                {coursesLoading ? (
                  <span className="text-gray-500 animate-pulse">
                    Loading courses...
                  </span>
                ) : expertiseCourses.length > 0 ? (
                  expertiseCourses.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {coursesMap[item.course_id] ||
                        `Course ID: ${item.course_id}`}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">
                    No expertise courses found.
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <span className="flex items-center gap-2 text-purple-600">
              <User className="w-5 h-5" />
              <CardTitle>Background Verification</CardTitle>
            </span>
            <span className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                Edit
              </Button>
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  Qualifications & Certifications
                </h4>
                <p className="text-gray-700">
                  {tutor.qualifications ||
                    tutor.certifications ||
                    tutor.education ||
                    ""}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">My Summary</h4>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      tutor.teaching_approach ||
                      tutor.teaching_style ||
                      tutor.summary ||
                      "",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <QualificationsSummaryEdit
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          expertiseData={{
            qualifications:
              tutor.qualifications ||
              tutor.certifications ||
              tutor.education ||
              "",
            teaching_approach:
              tutor.teaching_approach ||
              tutor.teaching_style ||
              tutor.summary ||
              "",
          }}
          tutorId={tutor?.id}
          onSave={handleSave}
        />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Video className="w-auto h-5" />
              Video Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tutor.public_url ? (
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-4">
                <video
                  src={tutor.public_url}
                  controls
                  className="w-full max-w-3xl aspect-video rounded-xl shadow-lg border border-blue-200"
                  style={{ minHeight: "260px", maxHeight: "520px" }}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-4">
                <Play className="w-16 h-16 text-gray-400 mb-2" />
                <p className="text-gray-600">Introduction Video</p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Watch my introduction video to learn more about my teaching style
              and approach.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Globe className="w-5 h-5" />
            Social Media & Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Facebook:</span>
              <p className="text-blue-600 hover:underline cursor-pointer">
                {tutor.facebook || tutor.social_facebook || ""}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">LinkedIn:</span>
              <p className="text-blue-600 hover:underline cursor-pointer">
                {tutor.linkedin || tutor.social_linkedin || ""}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Twitter/X:</span>
              <p className="text-blue-600 hover:underline cursor-pointer">
                {tutor.twitter || tutor.social_twitter || ""}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Instagram:</span>
              <p className="text-blue-600 hover:underline cursor-pointer">
                {tutor.instagram || tutor.social_instagram || ""}
              </p>
            </div>
            {/* <div className="col-span-2">
                            <span className="font-medium text-gray-600">Personal Website:</span>
                            <p className="text-blue-600 hover:underline cursor-pointer">{tutor.website || tutor.social_website || ""}</p>
                        </div> */}
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Connect With Me</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="p-2 bg-transparent"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 bg-transparent"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 bg-transparent"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 bg-transparent"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
              </Button>
              {/* <Button variant="outline" size="sm" className="p-2 bg-transparent">
                                <Globe className="w-4 h-4 text-gray-600" />
                            </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Profile Approved */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <CheckCircle className="w-5 h-5" />
            Profile Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-6 py-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Profile Approved
                </h3>
                <p className="text-sm text-green-600">
                  Your profile has been approved by our admin team
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
