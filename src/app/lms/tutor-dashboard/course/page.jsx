"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/lib/axios";
import { File, ListFilter, Loader2, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Course = () => {
  const [courseData, setCourseData] = useState([]);
  const [tutorId, setTutorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [checking, setChecking] = useState(true);


  // Fetch filtered tutor on mount and redirect if not verified
  useEffect(() => {
    async function fetchUserAndTutor() {
      try {
        // Get tutor ID from Redux state
        const tutorId = user?.tutor_id;
        if (tutorId) {
          const tutorsRes = await axios.get("/tutors?limit=1000");
          const foundTutor = Array.isArray(tutorsRes.data.data)
            ? tutorsRes.data.data.find(t => t.id === tutorId)
            : null;
          if (foundTutor && foundTutor.verified_tutor === false && foundTutor.summary !== null) {
            // Redirect to approval-pending page
            if (typeof window !== "undefined") {
              window.location.href = "/lms/tutor-dashboard/tutors-profile/approval-pending";
            }
            return;
          }
          else if (foundTutor && foundTutor.verified_tutor === false || foundTutor.verified_tutor === null && foundTutor.summary == null) {
            // Redirect to profile approval page
            if (typeof window !== "undefined") {
              window.location.href = "/lms/tutor-dashboard/tutors-profile";
            }
            return;
          }
          setFilteredTutor(foundTutor || null);
          if (foundTutor) {
            setProfileData({
              firstName: foundTutor.first_name || "",
              lastName: foundTutor.last_name || "",
              username: foundTutor.personal_email || foundTutor.email || "",
              email: foundTutor.personal_email || foundTutor.email || "",
              phone: foundTutor.mobile || "",
              bio: foundTutor.full_profile || "",
              subjects: foundTutor.subjects || [],
              experience: foundTutor.years_of_experience ? String(foundTutor.years_of_experience) : "",
            });
          }
        }
      } catch (err) {
        // ignore error for now
      }
      setChecking(false);
    }
    
    if (user) {
      fetchUserAndTutor();
    } else {
      setChecking(false);
    }
  }, [user]);

  const fetchTutorInfo = () => {
    try {
      // Get tutor ID from Redux state
      if (user?.tutor_id) {
        setTutorId(user.tutor_id);
      } else {
        console.error("Failed to get tutor info from user data");
      }
    } catch (error) {
      console.error("Error getting tutor info:", error);
    }
  };

  const fetchCourses = async (tutorId) => {
    try {
      const filter = encodeURIComponent(JSON.stringify({ primary_tutor: tutorId }));
      const res = await axios.get(`/courses?limit=1000&filter=${filter}`);
      setCourseData(res.data.data || []);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTutorInfo();
    }
  }, [user]);

  useEffect(() => {
    if (tutorId) {
      fetchCourses(tutorId);
    }
  }, [tutorId]);

  const filteredCourses = courseData.filter((course) =>
    course.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (checking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-4">
          {/* <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg> */}
          {/* <span className="animate-spin h-5 w-5 inline-block">⏳</span> */}
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <div className="text-lg font-semibold text-gray-700 mt-2">Checking for approval...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <div className="flex flex-col md:flex-row md:items-center md:ml-auto gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses"
                className="w-full pl-10 pr-4 py-1.5 border rounded-md focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Active
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button> */}
              <Link href="/lms/tutor-dashboard/course/add-new">
                <Button size="sm" className="h-8 gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Course
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* All Courses */}
        <TabsContent value="all" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>Manage your courses here.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-10">No courses found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount (%)</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <Link href={`/lms/tutor-dashboard/course/details/${course.id}`} className="text-blue-600 hover:underline">
                            {course.name}
                          </Link>
                        </TableCell>
                        <TableCell>{course.course_category?.name || "-"}</TableCell>
                        <TableCell>${course.regular_price}</TableCell>
                        <TableCell>{course.discounted_percentage ?? 0}%</TableCell>
                        <TableCell>
                          <Badge variant={course.course_approved ? "success" : "destructive"}>
                            {course.course_approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button className="h-8 gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-blue-700"
                            size="sm"
                            onClick={() =>
                              router.push(`/lms/tutor-dashboard/course/${course.id}`)
                            }
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Pagination className="w-full justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages).keys()].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Active Courses */}
        <TabsContent value="active" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Active Courses</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {filteredCourses.filter((c) => c.course_approved).length === 0 ? (
                <div className="text-center py-10">No active courses.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount (%)</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses
                      .filter((c) => c.course_approved)
                      .map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <Link href={`/lms/tutor-dashboard/course/details/${course.id}`} className="text-blue-600 hover:underline">
                              {course.name}
                            </Link>
                          </TableCell>
                          <TableCell>{course.course_category?.name || "-"}</TableCell>
                          <TableCell>${course.regular_price}</TableCell>
                          <TableCell>{course.discounted_percentage ?? 0}%</TableCell>
                          <TableCell>
                            <Badge variant="success">Approved</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() =>
                                router.push(`/lms/tutor-dashboard/course/${course.id}`)
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inactive Courses */}
        <TabsContent value="inactive" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Courses</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {filteredCourses.filter((c) => !c.course_approved).length === 0 ? (
                <div className="text-center py-10">No inactive courses.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount (%)</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses
                      .filter((c) => !c.course_approved)
                      .map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <Link href={`/lms/tutor-dashboard/course/details/${course.id}`} className="text-blue-600 hover:underline">
                              {course.name}
                            </Link>
                          </TableCell>
                          <TableCell>{course.course_category?.name || "-"}</TableCell>
                          <TableCell>${course.regular_price}</TableCell>
                          <TableCell>{course.discounted_percentage ?? 0}%</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Pending</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() =>
                                router.push(`/lms/tutor-dashboard/course/${course.id}`)
                              }
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Course;
