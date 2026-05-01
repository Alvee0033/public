"use client";
import courseImg1 from "@/assets/custom-image/course1.png";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EnhancedCourse = () => {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const formdata = new FormData();
        formdata.set("page", 1);
        formdata.set("pagination", 8);
        const res = await fetch("api/course", {
          method: "POST",
          body: formdata,
        });

        const data = await res.json();
        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    getCourses();
  }, []);

  const handleProfileClick = (course) => {
    router.push(`/course/id=${course._id}?name=${course.title}`);
  };

  // const categories = [
  //   "All",
  //   ...new Set(courses?.map((course) => course.category.categoryName)),
  // ];

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter(
        (course) => course.category.categoryName === activeCategory
      );

  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center justify-left mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 mr-1 ${star <= Math.round(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
              }`}
          />
        ))}
        <span className="ml-1 text-sm px-2 bg-brand rounded-md text-white">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-8 py-8 ">
      <div className="flex justify-between items-center text-left  pt-20 pb-10">
        <div>
          <h1 className="font-bold text-4xl text-primary">Trending Courses</h1>
          <h5 className="text-lg mt-2 text-gray-600">
            #Recently published courses
          </h5>
        </div>
        <div>
          <button className="text-gray-600 hover:bg-brand hover:text-white duration-100 border-[1px] px-10 py-3 border-gray-300 rounded-md">
            View All Trending
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses?.length === 0
          ? Array(8)
            // .fill(0)
            .map((_, index) => (
              <Card key={index} className="w-full">
                <CardHeader className="p-0">
                  <Skeleton className="h-80 w-full rounded-t-xl" />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))
          : filteredCourses?.map((course, index) => (
            <div key={index}>
              <Card
                key={course._id}
                className="w-full rounded-2xl overflow-hidden p-5 transition-all duration-300 hover:shadow-xl"
              >
                <Link href={`/course/${course._id}`}>
                  <CardHeader className="p-0 relative">
                    <Image
                      src={courseImg1}
                      alt={course.title}
                      className=" w-full object-cover rounded-lg"
                    />
                  </CardHeader>
                  <CardContent className="mt-3 pb-2 px-0">
                    <h3 className="text-lg font-bold text-primary truncate">
                      {course.title}
                    </h3>
                    <div className="flex gap-3 mt-4">
                      {/* <Image
                        className="w-8 rounded-full"
                        src={"/assets/custom-image/Eftyoffice.jpg"}
                        alt="Author Image"
                        width={300}
                      ></Image> */}
                      <h3>Ashikur Efty</h3>
                    </div>
                    <p className="mt-3 mb-3 text-gray-500 text-md">
                      In LifeStyle
                    </p>
                    <RatingStars rating={5.0} />
                    <div className="flex flex-row justify-between mt-8 text-gray-600 ">
                      <h5 className="flex items-center">
                        <span className="mr-2">
                          <Clock className="w-5 h-5"></Clock>
                        </span>{" "}
                        watch
                      </h5>

                      <h5 className="flex items-center">
                        <span className="mr-2">
                          <CalendarDays className="w-5 h-5 "></CalendarDays>
                        </span>{" "}
                        10-11-2024
                      </h5>
                    </div>
                    <button className=" w-full text-2xl py-1 mt-3 bg-brand rounded-md text-white font-semibold hover:scale-105 duration-200">
                      ${course.price}
                    </button>
                  </CardContent>
                </Link>
              </Card>

            </div>
          ))}
      </div>
    </div>
  );
};

export default EnhancedCourse;
