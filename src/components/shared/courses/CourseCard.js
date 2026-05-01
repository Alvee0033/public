'use client';

import { avatarPlaceHolder } from '@/assets/images';
import Image from 'next/image';
import Link from 'next/link';
let insId = 0;
const CourseCard = ({ course, type }) => {
  // Calculate insId for instructor routing
  const insId = (course?.id ?? 0) % 6 || 6;

  // Find category background
  // const cardBg = depBgs?.find(
  //   ({ category }) => category === course?.course_category_id
  // )?.bg;
  return (
    <div
      className={`group ${
        type === 'primary' || type === 'primaryMd'
          ? ''
          : `w-full sm:w-1/2 lg:w-1/3 grid-item ${
              type === 'lg' ? 'xl:w-1/4' : ''
            }`
      }`}
    >
      <div className={`${type === 'primaryMd' ? '' : 'sm:px-15px mb-30px'}`}>
        <div className="p-15px bg-whiteColor shadow-lg rounded-lg">
          {/* card image */}
          <div className="relative mb-2">
            <Link
              href={`/learninghub/course-list/${course?.id}`}
              className="w-full overflow-hidden rounded"
            >
              <Image
                src={
                  course?.image ||
                  'http://res.cloudinary.com/dnkqenu8j/image/upload/v1736759990/dnkqenu8j/c9hvbbnvzi8u8piahyx3.png'
                }
                width={600}
                height={300}
                alt={course?.name || ''}
                priority={true}
                className="w-full transition-all duration-300 group-hover:scale-110 aspect-video"
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div>
                <p
                  className={`text-xs text-whiteColor px-4 py-[3px] rounded font-semibold ${'cardBg'}`}
                >
                  {course?.course_category_id}
                </p>
              </div>
            </div>
          </div>
          {/* card content */}
          <div>
            <div className="grid grid-cols-2 mb-3">
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
            <h5 className={`${type === 'primaryMd' ? 'text-lg' : 'text-xl'}`}>
              <Link
                href={`/learninghub/course-list/${course?.id}`}
                className={`font-semibold text-blackColor mb-10px hover:text-primaryColor ${
                  type === 'primaryMd' ? 'leading-25px' : 'leading-27px'
                }`}
              >
                {course?.name}
              </Link>
            </h5>
            {/* price */}
            <div className="text-lg font-semibold text-primaryColor mb-4">
              ${course?.discounted_price?.toFixed(2)}
              <del className="text-sm text-lightGrey4 font-semibold ml-1">
                / ${course?.regular_price?.toFixed(2)}
              </del>
              <span
                className={`ml-6 text-base font-semibold ${
                  course?.free_or_paid_course
                    ? 'text-greencolor'
                    : 'text-secondaryColor3'
                }`}
              >
                {course?.free_or_paid_course ? 'Free' : <del>Paid</del>}
              </span>
            </div>
            {/* author and rating--> */}
            <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
              <div>
                <h6>
                  <Link
                    href={`/instructors/${insId}`}
                    className="text-base font-bold  flex items-center hover:text-primaryColor"
                  >
                    <Image
                      className="w-[30px] h-[30px] rounded-full mr-15px"
                      src={course?.instructor_image || avatarPlaceHolder}
                      alt={course?.instructor_name || ''}
                      width={300}
                      height={300}
                    />
                    <span className="whitespace-nowrap">
                      {course?.instructor_name}
                    </span>
                  </Link>
                </h6>
              </div>
              <div className="text-start md:text-end space-x-1">
                <i className="icofont-star text-size-15 text-yellow"></i>
                <i className="icofont-star text-size-15 text-yellow"></i>
                <i className="icofont-star text-size-15 text-yellow"></i>
                <i className="icofont-star text-size-15 text-yellow"></i>
                {type === 'primaryMd' ? (
                  ''
                ) : (
                  <i className="icofont-star text-size-15 text-yellow"></i>
                )}
                <span className="text-xs text-lightGrey6">(44)</span>
              </div>
            </div>
            {course?.is_completed ||
            (course?.is_active && course?.completed_percentage) ? (
              <div>
                <div className="h-25px w-full bg-blue-400-x-light rounded-md relative mt-5 mb-15px">
                  <div
                    className={`text-center bg-primaryColor absolute top-0 left-0  rounded-md leading-25px `}
                    style={{
                      width: course?.is_active
                        ? course?.completed_percentage
                        : '100%',
                      height: '100%',
                    }}
                  >
                    <span className="text-size-10 text-whiteColor block leading-25px px-1">
                      {course?.is_active ? course?.completed_percentage : 10}%
                      Completed
                    </span>
                  </div>
                </div>
                {course?.is_completed ? (
                  <div>
                    <Link
                      href="/dashboards/create-course"
                      className="text-size-15 text-whiteColor bg-secondaryColor w-full px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor rounded group text-nowrap text-center"
                    >
                      Download Certificate
                    </Link>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
