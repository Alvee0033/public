"use client";
import blogImag8 from "@/assets/images/blog/blog_8.png";
import CustomImage from "@/components/core/CustomImage";
import CourseDetailsSidebar from "@/components/shared/courses/CourseDetailsSidebar";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import useSWR from "swr";

const getCourseDetails = async (id) => {
  const res = await axios.get(`/courses/${id}`);
  return res?.data?.data;
};
const CourseDetailsPrimary = ({ type }) => {
  const { id } = useParams();
  const {
    data: course,
    isLoading,
    error,
  } = useSWR(`courseDetails/${id}`, () => getCourseDetails(id));

  return (
    <section>
      <div className="container py-10 md:py-50px lg:py-60px 2xl:py-100px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          <div className="lg:col-start-1 lg:col-span-8 space-y-[35px]">
            {/* course 1  */}
            <div>
              {/* course thumbnail  */}
              {type === 2 || type === 3 ? (
                ""
              ) : (
                <div className="overflow-hidden relative mb-5">
                  <CustomImage
                    src={course?.image || blogImag8}
                    alt=""
                    className="w-full"
                    width={500}
                    height={500}
                  />
                </div>
              )}
              {/* course content  */}
              <div>
                {type === 2 || type === 3 ? (
                  ""
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-6 mb-30px">
                      <div className="flex items-center gap-6">
                        {course?.top_trending_amount && (
                          <button className="text-sm text-whiteColor bg-primaryColor border border-primaryColor px-26px py-0.5 leading-23px font-semibold hover:text-primaryColor hover:bg-whiteColor rounded inline-block">
                            Featured
                          </button>
                        )}
                        <button className="text-sm text-whiteColor bg-indigo-400 border border-indigo px-22px py-0.5 leading-23px font-semibold hover:text-indigo-400 hover:bg-whiteColor rounded inline-block">
                          {course?.course_category_id}
                        </button>
                      </div>
                      <div>
                        <p className="text-sm text-contentColor font-medium">
                          Last Update:{" "}
                          <span className="text-blackColor ">Feb 19, 2025</span>
                        </p>
                      </div>
                    </div>
                    {/* titile  */}
                    <h4 className="text-size-32 md:text-4xl font-bold text-blackColor  mb-15px leading-43px md:leading-14.5">
                      {course?.name || "Making Music with Other People"}
                    </h4>
                    {/* price and rating  */}
                    <div className="flex gap-5 flex-wrap items-center mb-30px">
                      <div className="text-size-21 font-medium text-primaryColor font-inter leading-25px">
                        ${course?.regular_price?.toFixed(2) || "32.00"}{" "}
                        <del className="text-sm text-lightGrey4 font-semibold">
                          ${course?.discounted_price?.toFixed(2) || "67.00"}
                        </del>
                      </div>
                      <div className="flex items-center">
                        <div>
                          <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                        </div>
                        <div>
                          <span className=" text-black ">
                            {course?.number_of_book_lessons || "23 Lesson"}
                          </span>
                        </div>
                      </div>
                      {/* dynamic course rating */}
                      <div className="text-start md:text-end">
                        {[...Array(Math.ceil(course?.rating || 4.8))].map(
                          (_, index) => {
                            const rating = course?.rating || 4.8;
                            const isHalfStar =
                              rating - index > 0 && rating - index < 1;
                            const isFullStar = rating - index >= 1;
                            return (
                              <i
                                key={index}
                                className={`icofont-star text-size-15 ${
                                  isFullStar
                                    ? "text-yellow"
                                    : isHalfStar
                                    ? "text-yellow opacity-50"
                                    : "text-gray-300"
                                }`}
                              ></i>
                            );
                          }
                        )}{" "}
                        <span className="text-blackColor">
                          ({course?.total_ratings || 44})
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-sm md:text-lg text-contentColor mb-25px !leading-30px"
                      dangerouslySetInnerHTML={{
                        __html:
                          course?.description ||
                          `
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Curabitur vulputate vestibulum rhoncus, dolor eget viverra
                            pretium, dolor tellus aliquet nunc, vitae ultricies erat
                            elit eu lacus. Vestibulum non justo consectetur, cursus
                            ante, tincidunt sapien. Nulla quis diam sit amet turpis
                            interd enim. Vivamus faucibus ex sed nibh egestas
                            elementum. Mauris et bibendum dui. Aenean consequat
                            pulvinar luctus. Suspendisse consectetur tristique
                          `,
                      }}
                    ></div>
                    {/* details  */}
                    <div>
                      <h4 className="text-size-22 text-blackColor  font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
                        Course Details
                      </h4>
                      <div className="bg-  mb-30px grid grid-cols-1 md:grid-cols-2">
                        <ul className="p-10px md:py-4 md:pl-50px md:pr-70px lg:px-30px 2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor  space-y-[10px]">
                          {[
                            {
                              label: "Instructor :",
                              value: course?.primary_tutor?.name || "Mirnsdo.H",
                            },
                            {
                              label: "Lectures :",
                              value: `${
                                course?.number_of_book_lessons || 0
                              } sub`,
                            },
                            {
                              label: "Duration :",
                              value: course?.course_duration || "20h 41m 32s",
                            },
                            {
                              label: "Enrolled :",
                              value: `${
                                course?.enrolled_students || 0
                              } students`,
                            },
                            {
                              label: "Total :",
                              value: "222 students",
                            },
                          ].map(({ label, value }) => (
                            <li key={label}>
                              <p className="text-contentColor2  flex justify-between items-center">
                                {label}
                                <span className="text-base lg:text-sm 2xl:text-base text-blackColor  font-medium text-opacity-100">
                                  {value}
                                </span>
                              </p>
                            </li>
                          ))}
                        </ul>
                        <ul className="p-10px md:py-4 md:pl-50px md:pr-70px  lg:px-30px  2xl:pl-50px 2xl:pr-70px border-r-2 border-borderColor  space-y-[10px]">
                          {[
                            {
                              label: "Course level :",
                              value: course?.course_level || "Intermediate",
                            },
                            {
                              label: "Language :",
                              value: "English spanish",
                            },
                            {
                              label: "Price Discount :",
                              value: `${
                                course?.discounted_percentage || "20"
                              }%`,
                            },
                            {
                              label: "Regular Price :",
                              value: `$${course?.regular_price || "228"}/Mo`,
                            },
                            {
                              label: "Course Status :",
                              value: "Available",
                            },
                          ].map(({ label, value }) => (
                            <li key={label}>
                              <p className="text-contentColor2  flex justify-between items-center">
                                {label}
                                <span className="text-base lg:text-sm 2xl:text-base text-blackColor  font-medium text-opacity-100">
                                  {value}
                                </span>
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* course sidebar  */}
          <div
            className={`lg:col-start-9 lg:col-span-4 ${
              type === 2 || type === 3 ? "relative lg:top-[-340px]" : ""
            }`}
          >
            <CourseDetailsSidebar type={type} course={course} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsPrimary;
