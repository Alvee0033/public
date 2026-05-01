import tutionImage from "@/assets/images/about/tution.jpg";
import Image from "next/image";
import Accordion from "../accordion/Accordion";
import AccordionContent from "../accordion/AccordionContent";
import AccordionController from "../accordion/AccordionController";
import AccordionContainer from "../containers/AccordionContainer";
import HeadingPrimary from "../headings/HeadingPrimary";
import SectionName from "../section-names/SectionName";
import FeesItems from "./FeesItems";
const FeesContent = ({ title, subTitle }) => {
  const fees = [
    {
      title: "Semister 1",
      desc: "This is the second item's",
      price: 350,
      icon: <i className="icofont-read-book mr-10px"></i>,
    },
    {
      title: "Semister 2",
      desc: "This is the second item's",
      price: 280,
      icon: <i className="icofont-video-alt mr-10px"></i>,
    },
    {
      title: "Semister 3",
      desc: "Lorem ipsum dolor sit amet.",
      price: 300,
      icon: <i className="icofont-audio mr-10px"></i>,
    },
    {
      title: "Semister 4",
      desc: "Lorem ipsum dolor sit amet.",
      price: 350,
      icon: <i className="icofont-certificate mr-10px"></i>,
    },
    {
      title: "Semister 5",
      desc: "This is most Important",
      price: 0,
      isTotalPrice: true,
      icon: <i className="icofont-file-text mr-10px"></i>,
    },
  ];
  const accordions = [
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Business Administration (BBA)",
    "Computer Science & Engineering (CSE)",
    "Bachelor of Legislative Law (LLB)",
  ];
  return (
    <div className="container">
      <div className="mb-5 md:mb-10 ">
        <div className="text-center">
          <SectionName>{subTitle ? subTitle : "Updated"}</SectionName>
        </div>

        <HeadingPrimary text="center">
          {title ? title : "University Tuition & Fees"}
        </HeadingPrimary>
      </div>
      <div className="fees grid grid-cols-1 lg:grid-cols-12 gap-30px">
        <div className="lg:col-start-1 lg:col-span-5 xl:col-span-4">
          <Image src={tutionImage} alt="" className="rounded-lg2" />
        </div>
        {/* accordions */}
        <div className="lg:col-start-6 lg:col-span-7 xl:col-start-5 xl:col-span-8">
          <AccordionContainer>
            {/* accordion */}
            {accordions.map((accordion, idx) => (
              <Accordion
                key={idx}
                accordion="secondary"
                isActive={idx === 0 ? true : false}
              >
                <AccordionController>{accordion}</AccordionController>
                <AccordionContent>
                  <FeesItems fees={fees} />
                </AccordionContent>
              </Accordion>
            ))}
          </AccordionContainer>
        </div>
      </div>
    </div>
  );
};

export default FeesContent;
