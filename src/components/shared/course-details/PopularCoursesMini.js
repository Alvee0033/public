import courseDetailsImage6 from "@/assets/images/blog-details/blog-details__6.png";
import courseDetailsImage7 from "@/assets/images/blog-details/blog-details__7.png";
import courseDetailsImage8 from "@/assets/images/blog-details/blog-details__8.png";
import Image from "next/image";
import Link from "next/link";
// import courseDetailsImage9 from "@/assets/images/blog-details/blog-details__9.png";

const PopularCoursesMini = () => {
  return (
    <div className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 ">
      <h4 className="text-size-22 text-blackColor  font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Populer Course
      </h4>
      <ul className="flex flex-col gap-y-25px">
        {[
          {
            id: 1,
            image: courseDetailsImage6,
            price: "$29.99",
            title: "Introduction to Music Theory",
          },
          {
            id: 2,
            image: courseDetailsImage7,
            price: "$45.00",
            title: "Advanced Guitar Techniques",
          },
          {
            id: 3,
            image: courseDetailsImage8,
            price: "$35.50",
            title: "Piano for Beginners",
          },
        ].map(({ id, image, price, title }) => (
          <li key={id} className="flex items-center">
            <div className="w-[91px] h-auto mr-5 flex-shrink-0">
              <Link href={`${id}`} className="w-full">
                <Image src={image} alt="" className="w-full" />
              </Link>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm text-primaryColor font-medium leading-[17px]">
                {price}
              </h3>
              <Link
                href={`/courses/${id}`}
                className="text-blackColor hover:text-primaryColor font-semibold leading-22px"
              >
                {title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularCoursesMini;
