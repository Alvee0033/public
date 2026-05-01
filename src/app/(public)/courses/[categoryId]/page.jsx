"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  BookOpen,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = params.categoryId;

  // Pagination state
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = 9; // Items per page

  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategoryAndCourses = async () => {
      setLoading(true);
      try {
        // Fetch category details
        const catRes = await axios.get(`/course-categories/${categoryId}`);
        if (catRes.data && catRes.data.data) {
          setCategory(catRes.data.data);
        }

        // Fetch courses
        const filter = JSON.stringify({ course_category: categoryId });
        const skip = (currentPage - 1) * pageSize;
        const courseRes = await axios.get(`/courses`, {
          params: { filter, skip, limit: pageSize },
        });
        setCourses(courseRes.data.data || []);
        if (courseRes.data.meta && courseRes.data.meta.total) {
          setTotalCourses(courseRes.data.meta.total);
          setTotalPages(Math.ceil(courseRes.data.meta.total / pageSize));
        }
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndCourses();
    }
  }, [categoryId, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams();
    params.set("page", newPage);
    router.push(`/courses/${categoryId}?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/learninghub/course-list"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            {/* <ArrowLeft className="h-4 w-4 mr-2" /> */}
            See All Courses
          </Link>
          {loading && !category ? (
            <div className="text-3xl font-bold mb-2">
              <Skeleton className="h-9 w-64" />
            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-2">
              {category?.name
                ? category.name.toLowerCase().includes("course")
                  ? category.name
                  : `${category.name} Courses`
                : "Courses"}
            </h1>
          )}
          {loading && !category ? (
            <div className="text-gray-600">
              <Skeleton className="h-6 w-full max-w-2xl" />
            </div>
          ) : (
            <p className="text-gray-600">
              {category?.description || `Browse all courses in this category`}
            </p>
          )}
          {totalCourses > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {courses.length} of {totalCourses} courses
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading && currentPage === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <GraduationCap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6">
              There are no courses available in this category yet.
            </p>
            <Link href="/learninghub/course-list">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={course.image || "/placeholder-course.jpg"}
                      alt={course.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {course.name}
                      </h3>
                      {course.rating_score && (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-1" />
                          {course.rating_score}
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.short_description?.replace(/<[^>]*>?/gm, "") ||
                        "No description available."}
                    </p>

                    <div className="flex gap-3 text-xs text-gray-500 mb-4">
                      {course.course_duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.course_duration}
                        </div>
                      )}
                      {course.number_of_modules && (
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.number_of_modules} Modules
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {course.institute?.logo && (
                          <div className="h-6 w-6 rounded-full overflow-hidden mr-2 relative">
                            <Image
                              src={course.institute.logo}
                              alt={course.institute.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-xs text-gray-600">
                          {course.institute?.name}
                        </span>
                      </div>
                      <div>
                        {/* Pricing logic */}
                        {course.discounted_price != null &&
                        course.regular_price != null ? (
                          <div>
                            <span className="text-lg font-bold text-blue-600">
                              ${course.discounted_price}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${course.regular_price}
                            </span>
                          </div>
                        ) : course.discounted_price != null ? (
                          <span className="text-lg font-bold text-blue-600">
                            ${course.discounted_price === 0
                              ? "0"
                              : course.discounted_price}
                          </span>
                        ) : course.regular_price != null ? (
                          <span className="text-lg font-bold text-blue-600">
                            ${course.regular_price === 0
                              ? "0"
                              : course.regular_price}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t p-4">
                    <Link
                      href={`/learninghub/course-details/${course.id}`}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View Course
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="px-2 text-gray-400">...</span>
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              className={
                                currentPage === page ? "bg-blue-600" : ""
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              disabled={loading}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          className={currentPage === page ? "bg-blue-600" : ""}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                        >
                          {page}
                        </Button>
                      );
                    })}

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {loading && currentPage > 1 && (
          <div className="flex justify-center mt-8">
            <div className="rounded-md bg-white p-4 shadow w-32 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
