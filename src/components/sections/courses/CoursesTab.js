"use client";
import BestSellingContent from "@/components/shared/courses/BestSellingContent";
import HotDealContent from "@/components/shared/courses/HotDealContent";
import NewCollectionContent from "@/components/shared/courses/NewCollectionContent";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import useTab from "@/hooks/useTab";
import getAllCourses from "@/libs/getAllCourses";
const CoursesTab = () => {
  const { currentIdx, handleTabClick } = useTab();
  const courses = getAllCourses();

  const tabButtons = [
    {
      name: "New Collection",
      content: <NewCollectionContent courses={courses?.slice(0, 4)} />,
    },
    {
      name: "Hot Sale",
      content: <HotDealContent courses={courses?.slice(9, 13)} />,
    },
    {
      name: "Best Selling",
      content: (
        <BestSellingContent
          courses={[
            ...courses?.filter(({ id }) => id > 4 && id < 8),
            ...courses?.slice(0, 1),
          ]}
        />
      ),
    },
  ];
  return (
    <section>
      <div className="container-fluid-2 pb-100px pt-30px container">
        {/* heading */}
        <div className="mb-5 md:mb-10">
          <div className="text-center">
          </div>

          <HeadingPrimary text="center">
            Perfect Online{" "}
            <span className="relative after:w-full after:h-[7px] z-0 after:bg-secondaryColor after:absolute after:left-0 after:bottom-3 md:after:bottom-5 after:z-[-1]">
              Course
            </span>
            <br />
          </HeadingPrimary>
        </div>
        <div className="product-details-course">
          <div className="flex justify-center flex-wrap md:flex-nowrap rounded">
            {tabButtons?.map(({ name }, idx) => (
              <button
                onClick={() => handleTabClick(idx)}
                key={idx}
                className={`relative text-xl font-medium ${
                  idx === currentIdx ? "text-primaryColor" : "text-blackColor "
                } pb-10px mb-15px mr-8 hover:text-primaryColor  `}
              >
                {name}
              </button>
            ))}
          </div>
          {/* tab contents */}
          <div>
            {tabButtons?.map(({ content }, idx) => (
              <TabContentWrapper
                key={idx}
                isShow={currentIdx === idx ? true : false}
              >
                {content}
              </TabContentWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesTab;
