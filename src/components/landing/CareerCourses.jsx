"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import axios from "@/lib/axios";

// Course Card Skeleton Component
const CourseCardSkeleton = () => (
  <Card className="flex flex-col h-full">
    <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
      <div className="space-y-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded w-full animate-pulse"
          ></div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse mt-auto"></div>
    </CardContent>
  </Card>
);

const CareerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/courses/career-courses");

        // Handle both paginated and non-paginated responses
        const coursesData = response.data?.data || response.data;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Career Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry-aligned training programs for high-demand careers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">
              No career courses available at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Career Courses Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Career Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry-aligned training programs for high-demand careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses &&
              Array.isArray(courses) &&
              courses.map((course) => (
                <Card key={course.id} className="flex flex-col h-full">
                  <div className="relative">
                    <img
                      src={course.image || "/images/placeholder-course.png"}
                      alt={course.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {course.is_trending_course && (
                      <Badge className="absolute top-2 left-2 bg-[#008fb0] text-primary-foreground">
                        Trending
                      </Badge>
                    )}
                    {course.has_scholarship && (
                      <Badge className="absolute top-2 right-2 bg-[#008fb0] text-primary-foreground">
                        Scholarship Available
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription>
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            course.short_description ||
                            course.description?.substring(0, 100),
                        }}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="flex-grow">
                      <ul className="space-y-2 mb-4">
                        {course.course_duration && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#008fb0]" />
                            <span className="text-sm">
                              Duration: {course.course_duration}
                            </span>
                          </li>
                        )}
                        {course.number_of_modules > 0 && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#008fb0]" />
                            <span className="text-sm">
                              {course.number_of_modules} Modules
                            </span>
                          </li>
                        )}
                        {course.number_of_video_lessons > 0 && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#008fb0]" />
                            <span className="text-sm">
                              {course.number_of_video_lessons} Video Lessons
                            </span>
                          </li>
                        )}
                        {course.number_of_live_tutors_lessons > 0 && (
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#008fb0]" />
                            <span className="text-sm">
                              {course.number_of_live_tutors_lessons} Live
                              Sessions
                            </span>
                          </li>
                        )}
                      </ul>

                      {course.regular_price > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-[#008fb0]">
                              ${course.discounted_price || course.regular_price}
                            </span>
                            {course.discounted_price &&
                              course.discounted_price <
                                course.regular_price && (
                                <>
                                  <span className="text-sm line-through text-muted-foreground">
                                    ${course.regular_price}
                                  </span>
                                  {course.discounted_percentage > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {course.discounted_percentage}%
                                      Scholarship
                                    </Badge>
                                  )}
                                </>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant={course.has_scholarship ? "default" : "outline"}
                      className={
                        course.has_scholarship
                          ? "w-full mt-auto bg-[#008fb0] hover:bg-[#007a95] text-white px-6 py-3"
                          : "w-full mt-auto bg-transparent"
                      }
                      asChild
                    >
                      <Link href={`/learninghub/course-details/${course.id}`}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/learninghub/career-courses">
                View More Career Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerCourses;
