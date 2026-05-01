"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  BookOpen,
  Clock,
  GraduationCap,
  Play,
  Users,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "@/lib/axios";
import { courseNotFound } from "@/assets/images";
import parseHtml from "@/lib/parseHtml";
import Spinner from "@/components/spinner";

const BundleCoursesPage = () => {
  const [bundleCourses, setBundleCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBundleCourses();
  }, []);

  const fetchBundleCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/bundle-selected-course/my-courses");

      if (response.data.status === "SUCCESS") {
        const { data } = response.data;

        // Convert the nested object structure to an array of courses
        if (data && typeof data === "object") {
          const allCourses = [];
          Object.keys(data).forEach((bundleKey) => {
            if (Array.isArray(data[bundleKey])) {
              allCourses.push(...data[bundleKey]);
            }
          });
          setBundleCourses(allCourses);
        } else {
          setBundleCourses([]);
        }
      } else {
        setBundleCourses([]);
      }
    } catch (err) {
      console.error("Error fetching bundle courses:", err);
      setError(err.message || "Failed to fetch bundle courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg border-gray-200"
            >
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <div className="p-5 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              onClick={fetchBundleCourses}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Bundle Courses
        </h1>
        <p className="text-gray-600">
          Courses from your purchased bundles ({bundleCourses.length} courses
          available)
        </p>
      </div>

      {bundleCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Bundle Courses Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't purchased any bundle courses yet.
          </p>
          <Link href="/learninghub">
            <Button>
              Explore Bundles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundleCourses.map((courseItem) => (
            <BundleCourseCard key={courseItem.id} courseItem={courseItem} />
          ))}
        </div>
      )}
    </div>
  );
};

const BundleCourseCard = ({ courseItem }) => {
  const { course, bundle } = courseItem;

  // Extract course data with fallbacks
  const courseName = course?.name || "Course Name Not Available";
  const courseImage = course?.image || courseNotFound;
  const courseDescription =
    course?.short_description || course?.description || "";
  const cleanDescription = parseHtml(courseDescription);
  const grade = course?.master_k12_grade || "Grade Not Specified";

  // Bundle information
  const bundleName = bundle?.name || "Bundle Name Not Available";
  const bundlePrice = bundle?.regular_price || 0;
  const bundleDiscountedPrice = bundle?.discounted_price || 0;
  const bundleDiscount = bundle?.discounted_percentage || 0;

  // Course pricing
  const coursePrice = course?.regular_price || 0;

  const handleStartCourse = () => {
    // Navigate to course player or course details
    window.location.href = `/lms/student-dashboard/course-player/${course?.id}`;
  };

  const handleViewDetails = () => {
    // Navigate to course details page
    window.location.href = `/learninghub/course-details/${course?.id}`;
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Course Image */}
      <div className="relative w-full h-48">
        <Image
          src={courseImage}
          alt={courseName}
          fill
          className="object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = courseNotFound;
          }}
        />

        {/* Bundle Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
            Bundle Course
          </Badge>
        </div>

        {/* Discount Badge */}
        {bundleDiscount > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="text-xs">
              {bundleDiscount}% Scholarship
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
          {courseName}
        </CardTitle>
        <div className="space-y-1">
          <p className="text-sm text-blue-600 font-medium">
            From: {bundleName}
          </p>
          <p className="text-xs text-gray-500">Grade: {grade}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {cleanDescription && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {cleanDescription}
          </p>
        )}

        {/* Course Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Live Tutoring Sessions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Interactive Learning</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Play className="w-4 h-4 text-blue-600" />
            <span>Self-Paced Content</span>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Course Value:</span>
            <span className="font-semibold text-gray-900">
              ${coursePrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Bundle Price:</span>
            <div className="text-right">
              {bundleDiscountedPrice < bundlePrice ? (
                <>
                  <span className="text-sm line-through text-gray-400">
                    ${bundlePrice.toLocaleString()}
                  </span>
                  <span className="ml-2 font-semibold text-green-600">
                    ${bundleDiscountedPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-gray-900">
                  ${bundlePrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleStartCourse}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Learning
          </Button>
          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleCoursesPage;
