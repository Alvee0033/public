import aboutImag15 from "@/assets/images/about/about_15.png";
import LessonAccordion from "@/components/shared/lessons/LessonAccordion";
import Image from "next/image";
const LessonCourseMaterialsPrimary = () => {
  return (
    <section>
      <div className="container-fluid-2 py-100px">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-30px">
          {/* lesson left */}
          <div className="xl:col-start-1 xl:col-span-4">
            {/* curriculum */}
            <LessonAccordion />
          </div>
          {/* lesson right */}
          <div className="xl:col-start-5 xl:col-span-8 relative">
            <div className="2xl:ml-65px">
              <h3 className="text-3xl md:text-size-45 leading-10 md:leading-2xl font-bold text-blackColor  pb-30px md:pb-10px lg:pb-30px">
                Projects you will made.
              </h3>
              <p className="text-sm md:text-base leading-7 text-contentColor  mb-25px">
                Meet my startup design agency Shape Rex Currently I am working
                at CodeNext as Product Designer. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. A, quaerat excepturi accusantium
                eum, dolorem ipsa deleniti dicta voluptates reiciendis tempore
                aliquid assumenda at labore, unde quibusdam! Tenetur hic enim
                odit.
                <br />
                <br />
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
                illum facilis quaerat expedita. Inventore, commodi. Non
                molestias neque esse ipsam temporibus quia accusantium voluptas
                facilis enim blanditiis, doloribus, facere omnis.
              </p>
              <p className="flex items-center gap-x-4 text-lg text-blackColor  mb-15px">
                <Image loading="lazy" src={aboutImag15} alt="about" />{" "}
                <span>
                  <b>10+ Years ExperienceIn</b> this game, Means Product
                  Designing
                </span>
              </p>
              <p className="text-sm md:text-base leading-7 text-contentColor  mb-15px">
                I love to work in User Experience & User Interface designing.
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Provident quod, maxime dolor beatae repellendus blanditiis error
                molestias accusamus optio suscipit nostrum tempora consectetur,
                vel placeat pariatur aliquid nisi harum sed cupiditate
                repudiandae dolorum facere repellat fugit.
              </p>
              <ul className="space-y-5">
                <li className="flex items-center group">
                  <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px "></i>
                  <p className="text-sm md:text-base font-medium text-blackColor ">
                    eCommerce design, Creative.
                  </p>
                </li>
                <li className="flex items-center group">
                  <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px "></i>
                  <p className="text-sm md:text-base font-medium text-blackColor ">
                    Business, Corporate, Education.
                  </p>
                </li>
                <li className="flex items-center group">
                  <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px "></i>
                  <p className="text-sm md:text-base font-medium text-blackColor ">
                    Business, Corporate, Education.
                  </p>
                </li>
                <li className="flex items-center group">
                  <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px "></i>
                  <p className="text-sm md:text-base font-medium text-blackColor ">
                    Non-Profit, It & Tech, Hosting.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonCourseMaterialsPrimary;
