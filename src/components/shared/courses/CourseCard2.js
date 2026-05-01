'use client';
import { avatarPlaceHolder } from '@/assets/images';
import CustomImage from '@/components/core/CustomImage';
import Link from 'next/link';
let insId = 0;
const CourseCard2 = ({ course, card, isList, isNotSidebar }) => {
  const insId = (course?.id ?? 0) % 6 || 6;

  return (
    <div className="w-full group grid-item rounded">
      <div className="tab-content-wrapper">
        <div
          className={`p-15px lg:pr-30px bg-whiteColor shadow-lg flex flex-wrap ${
            card ? 'lg:flex-nowrap' : 'md:flex-nowrap'
          } rounded`}
        >
          {/* card image */}
          <div
            className={`relative overflow-hidden w-full leading-1 ${
              card ? 'lg:w-2/5' : 'md:w-35%'
            }`}
          >
            <Link
              href={`/learninghub/course-list/${course?.id}`}
              className="w-full overflow-hidden rounded"
            >
              <CustomImage
                src={
                  course?.image ||
                  'http://res.cloudinary.com/dnkqenu8j/image/upload/v1736759990/dnkqenu8j/c9hvbbnvzi8u8piahyx3.png'
                }
                alt={course?.name || ''}
                width={300}
                height={300}
                className="w-full transition-all duration-300 scale-105 group-hover:scale-110 -mb-1 aspect-video"
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div>
                <p
                  className={`text-xs text-whiteColor px-4 py-[3px] rounded font-semibold capitalize ${'cardBg'}`}
                >
                  {course?.course_category_id}
                </p>
              </div>
            </div>
          </div>

          {/* card content */}
          <div className={`w-full ${card ? 'lg:w-3/5' : 'md:w-65% '}`}>
            <div
              className={`pl-0 md:pl-5 lg:pl-30px ${
                isNotSidebar ? '2xl:pl-90px' : ''
              }`}
            >
              <div className="grid grid-cols-2 mb-15px">
                <div className="flex items-center">
                  <div>
                    <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                  </div>
                  <div>
                    <span className="text-sm text-black">
                      {course?.number_of_book_lessons}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                  </div>
                  <div>
                    <span className="text-sm text-black">
                      {course?.course_duration}
                    </span>
                  </div>
                </div>
              </div>

              <h4>
                <Link
                  href={`/learninghub/course-list/${course?.id}`}
                  className={`${
                    card
                      ? 'text-size-26 leading-30px'
                      : 'text-xl 2xl:text-size-34 2xl:!leading-9'
                  } font-semibold text-blackColor mb-10px hover:text-primaryColor`}
                >
                  {course?.name}
                </Link>
              </h4>

              {/* price */}
              <div className="text-lg font-medium text-black-brerry-light mb-4">
                ${course?.discounted_price?.toFixed(2)}
                <del className="text-sm text-lightGrey4 font-semibold">
                  / ${course?.regular_price?.toFixed(2)}
                </del>
                <span
                  className={`ml-6 text-base font-semibold ${
                    course?.free_or_paid_course
                      ? 'text-greencolor'
                      : 'text-secondaryColor3'
                  }`}
                >
                  {course?.free_or_paid_course ? 'Free' : <span>Paid</span>}
                </span>
              </div>

              {/* bottom */}
              <div className="flex flex-wrap justify-between sm:flex-nowrap items-center gap-y-2 pt-15px border-t border-borderColor">
                {/* author and rating */}
                <div className="flex items-center flex-wrap">
                  <div>
                    <Link
                      href={`/instructors/${insId}`}
                      className="text-sm font-medium font-hind flex items-center hover:text-primaryColor"
                    >
                      <CustomImage
                        className="w-[30px] h-[30px] rounded-full mr-15px"
                        src={course?.instructor_image || avatarPlaceHolder}
                        alt={course?.instructor_name || ''}
                        width={300}
                        height={300}
                      />
                      <span className="flex">{course?.instructor_name}</span>
                    </Link>
                  </div>
                  <div className="text-start md:text-end ml-35px">
                    {/* Rating stars */}
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <i className="icofont-star text-size-15 text-yellow"></i>
                    <span className="text-xs text-lightGrey6">
                      ({course?.rating_score || 0})
                    </span>
                  </div>
                </div>

                <div>
                  <Link
                    className="text-sm lg:text-base text-blackColor hover:text-primaryColor"
                    href={`/learninghub/course-list/${course?.id}`}
                  >
                    See Details
                    <i className="icofont-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard2;
