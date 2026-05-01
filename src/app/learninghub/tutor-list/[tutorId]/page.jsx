/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

// pages/course.js
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChevronRight,
  CirclePlay,
  FileCheck,
  Flame,
  Heart,
  House,
  Linkedin,
  MapPin,
  MessageCircleMore,
  Phone,
  Star,
  Twitter,
  Watch,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "./style.css";

export default function Page() {
  return (
    <div className="bg-gray-100 min-h-screen ">
      <div className=" mx-auto pb-8 ">
        <div className="bg-white">
          <div className="">
            <div className="inset-0 flex items-center justify-start ">
              <div className=" overview-tab float-left bg-blue-900 pb-24 md:pb-36 lg:pb-52 w-full ">
                <div className="star-icon text-white flex flex-col md:flex-row lg:flex-row pt-4 ">
                  <div className="calender text-white flex max-sm:flex-none pt-4 ">
                    <a href="#">
                      <span className=" home-icon font-semibold text-sm">
                        <House></House>
                      </span>
                    </a>
                    <span className="pl-3">
                      <ChevronRight />
                    </span>
                  </div>
                  <div className="calender text-white flex max-sm:flex-none pt-4 lg:px-3 ">
                    <a href="#">
                      <span className=" font-semibold  ">Find a Mentor</span>
                    </a>
                    <span className="pl-3">
                      <ChevronRight />
                    </span>
                  </div>
                  <div className="place text-white flex max-sm:flex-none pt-4 ">
                    <a href="#">
                      <span className=" font-semibold  ">RZ Tutul</span>
                    </a>
                  </div>
                </div>

                <div className="clear"></div>
                <div className="banner-review mt-3 w-auto">
                  <div className="image-part absolute mt-5 md:mt-16 lg:mt-16 flex flex- lg:flex-row items-center  pt-2 w-auto">
                    <div className="mentor-image w-24 h-24 lg:h-48 lg:w-48 p-1 bg-white rounded-full">
                      <img
                        className="rounded-full"
                        src="https://avatars.githubusercontent.com/u/37795928?v=4"
                        alt=""
                      />
                    </div>
                    <div className="star-icon text-white flex flex-col md:flex-col lg:flex-row items-center pointer">
                      <button
                        type="button"
                        className="flex flex-row text-xs lg:text-base cursor-pointer text-center bg-white px-2 lg:px-4 py-1 lg:py-2 ml-2 lg:ml-5 text-gray-700 rounded-3xl">
                        <span className="zap-icon">
                          <Zap />
                        </span>
                        <span className=" font-semibold pr-0 mt-1 lg:mt-0 lg:pr-5 pl-0 lg:pl-2">
                          <h5>Quick Responder</h5>
                        </span>
                      </button>
                    </div>
                    <div className="star-icon text-white flex flex-row ml-5 md:flex-row lg:flex-row items-center ">
                      <span>
                        <Twitter />
                      </span>
                      <span className=" font-semibold pr-5 pl-2">
                        <Linkedin />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-6 md:px-8 md:pt-8 mt-4 lg:mt-16">
            <div className="grid lg:grid-cols-3 grid-row-2 mb-6 ">
              <div className="mentor-name">
                <h4 className="font-bold text-2xl">RZ Tutul</h4>
                <p className="inline-block font-medium text-slate-700 text-md pt-2 leading-normal">
                  Product Design | SaaS Dashboard | UX <br />
                  Consultant @ ProDesign.tech <br />{" "}
                  <span className="text-green-700">
                    15+ Years of UX UI Design Experience
                  </span>
                </p>
                <div className="pt-4 font-normal mentor-icon-part">
                  <div className="mentor-icon flex mt-2">
                    <span className="details-icon">
                      <MapPin />
                    </span>
                    <span className="pl-2 text-slate-700 font-medium">
                      Gulshan, Dhaka, Bangladesh.
                    </span>
                  </div>
                  <div className="mentor-icon flex pt-1">
                    <span className="details-icon">
                      <Star />
                    </span>
                    <span className="pl-2 text-slate-700 font-medium">
                      5.0 (65 reviews)
                    </span>
                  </div>
                  <div className="mentor-icon flex pt-1">
                    <span className="details-icon">
                      <Watch />
                    </span>
                    <span className="pl-2 text-slate-700 font-medium">
                      Activity Today
                    </span>
                  </div>
                  <div className="mentor-icon flex pt-1">
                    <span className="details-icon">
                      <FileCheck />
                    </span>
                    <span className="pl-2 text-slate-700 font-medium">
                      Usually responds in half a day
                    </span>
                  </div>
                  <div className="mentor-button cursor-pointer pt-3 mt-4">
                    <div className="mentor-button2">
                      <span className="inline-block px-3 py-2 hover:bg-gray-100 rounded-md border border-gray-300">
                        <div className="play-text flex">
                          <CirclePlay></CirclePlay>
                          <a
                            className="ml-1 font-semibold float-left "
                            href="#">
                            Play Intro
                          </a>
                        </div>
                      </span>
                      <span className="inline-block px-3 py-2 ml-2 hover:bg-gray-100 rounded-md border border-gray-300">
                        <div className="save-text flex">
                          <Heart></Heart>
                          <a
                            className="ml-1 font-semibold float-left "
                            href="#">
                            Save
                          </a>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="skill-part items-start lg:pt-2 lg:pr-0 pt-4 md:pr-80">
                <div className="skill-text">
                  <h3 className="text-gray-700 font-semibold pb-2">Skill</h3>
                </div>
                <div className="skill-text2">
                  <div className="skill-text3">
                    <h5>React</h5>
                    <h5>Next JS</h5>
                    <h5>Javascript</h5>
                    <h5>Node JS</h5>
                    <h5>Mongo DB</h5>
                    <h5>Tailwind Css</h5>
                    <h5>Bootstrap</h5>
                    <h5>HTML</h5>
                    <h5>CSS</h5>
                  </div>
                  <div className="clear"></div>
                  <div className="view-more mt-2">
                    <a
                      className="font-semibold border-b text-slate-600"
                      href="">
                      +10 more
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="price-main">
              <div className="  grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-5">
                <div className="price-part order-1 lg:order-last lg:col-span-2 md:absolute lg:absolute md:right-0 lg:right-10 top-60 w-96  snap-center  ">
                  <div className="price-sub-part shadow-md w-80 lg:w-96 rounded-lg p-4 mb-5 bg-gray-100">
                    <div className="mt-4 text-gray-700">
                      <p className="text-4xl font-semibold">
                        $150/
                        <span className="text-lg font-bold text-black">
                          month
                        </span>
                      </p>
                      <p className="pt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Et quia odit exercitationem natus aperiam nulla alias ut
                        facilis tenetur quod!
                      </p>
                      <div className="pt-3 font-normal mentor-icon-part">
                        <div className="mentor-icon flex pt-1">
                          <span className="details-icon">
                            <Phone />
                          </span>
                          <span className="pl-2 text-slate-700 font-medium">
                            2 calls per month
                          </span>
                        </div>
                        <div className="mentor-icon flex pt-1">
                          <span className="details-icon">
                            <MessageCircleMore />
                          </span>
                          <span className="pl-2 text-slate-700 font-medium">
                            Unlimited Q&A via chat
                          </span>
                        </div>
                        <div className="mentor-icon flex pt-1">
                          <span className="details-icon">
                            <Watch />
                          </span>
                          <span className="pl-2 text-slate-700 font-medium">
                            Expect responses in 24 hours or less
                          </span>
                        </div>
                        <div className="mentor-icon flex pt-1">
                          <span className="details-icon">
                            <BriefcaseBusiness />
                          </span>
                          <span className="pl-2 text-slate-700 font-medium">
                            Hands-on support
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700">
                        Apply Now
                      </button>
                      <p className="flex price-text">
                        <span className="fire-icon">
                          <Flame />
                        </span>
                        <span className="pl-2">Lock is this price now.</span>
                      </p>
                    </div>
                  </div>

                  <div className="free-trial-text flex w-80 lg:w-96 bg-teal-50 p-2 pb-2">
                    <BadgeCheck></BadgeCheck>
                    <div className="ml-2 trial-text">
                      <></>
                      <h5 className="font-semibold text-green-700">
                        7 Days free trial
                      </h5>
                      <h5 className="">Cancel anytime</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b w-3/5 ml-8 mt-8"></div>
          <div className="about-part w-full lg:w-2/3 px-8 pt-10">
            <h3 className="text-2xl font-bold ">About</h3>
            <p className="font-normal text-lg text-slate-600 pt-5">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
              quae, fugiat, unde vitae voluptatibus voluptas molestiae tempore
              dolores id suscipit quasi exercitationem sint facilis incidunt?{" "}
              Ducimus a, adipisci dolorum at earum itaque sunt numquam magnam!
              Ex non enim placeat numquam quis fugiat, repellat earum maiores
              nulla. In quibusdam odit modi sed recusandae soluta suscipit cum
              eveniet esse quae enim, ut fuga nulla, quod nam tempore voluptatum
              deserunt. <br /> <br />
              <span>Let&apos;s collaborate and work together</span>
            </p>
          </div>

          <div className="open-part w-4/5 lg:w-3/5  p-5 rounded-lg lg:flex mx-8 mt-8 mb-3 pb-3 bg-teal-50">
            <div className="open-icon-main flex flex-row">
              <div className="open-icon ">
                <MessageCircleMore></MessageCircleMore>
              </div>
              <div className="open-text ml-4">
                <h3 className="font-semibold">Open to inquiries</h3>
                <h5 className="text-slate-500 font-normal">
                  You can message Muhammad Ahsan to ask questions before booking
                  their services
                </h5>
              </div>
            </div>
            <div className="get-in bg-white border rounded-md mt-2 lg:mt-0 ml-5 items-center px-4 py-2 font-smibold">
              <h4 className="text-center items-center">Get in touch</h4>
            </div>
          </div>
          <div className="border-b w-4/5 lg:w-3/5 ml-8 mt-8 mb-8"></div>

          <div className=" w-4/5 lg:w-3/5 ml-8  bg-teal-50 p-6  text-[#333] font-[sans-serif] rounded-md">
            <div className="grid sm:grid-cols-3 items-center gap-2">
              <div className="flex items-center gap-2 max-sm:mb-6">
                <h3 className="font-extrabold text-5xl">3.0</h3>
                <svg
                  className="w-6 fill-[#facc15] shrink-0"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="flex items-center">
                  <p className="text-xs font-bold">5.0</p>
                  <div className="bg-gray-300 rounded w-full h-2 ml-3">
                    <div className="w-2/3 h-full rounded bg-[#facc15]"></div>
                  </div>
                  <p className="text-xs font-bold ml-3">66%</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs font-bold">4.0</p>
                  <div className="bg-gray-300 rounded w-full h-2 ml-3">
                    <div className="w-1/3 h-full rounded bg-[#facc15]"></div>
                  </div>
                  <p className="text-xs font-bold ml-3">33%</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs font-bold">3.0</p>
                  <div className="bg-gray-300 rounded w-full h-2 ml-3">
                    <div className="w-1/6 h-full rounded bg-[#facc15]"></div>
                  </div>
                  <p className="text-xs font-bold ml-3">16%</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs font-bold">2.0</p>
                  <div className="bg-gray-300 rounded w-full h-2 ml-3">
                    <div className="w-1/12 h-full rounded bg-[#facc15]"></div>
                  </div>
                  <p className="text-xs font-bold ml-3">8%</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs font-bold">1.0</p>
                  <div className="bg-gray-300 rounded w-full h-2 ml-3">
                    <div className="w-[6%] h-full rounded bg-[#facc15]"></div>
                  </div>
                  <p className="text-xs font-bold ml-3">6%</p>
                </div>
              </div>
            </div>
            <hr className="border border-gray-300 my-6" />
            <div>
              <h3 className="font-bold text-base">All Reviews(2)</h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <img
                    src="https://avatars.githubusercontent.com/u/37795928?v=4"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="ml-3">
                    <h4 className="text-sm font-bold">John Doe</h4>
                    <div className="flex space-x-1 mt-1">
                      <svg
                        className="w-4 fill-[#facc15]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#facc15]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#facc15]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#CED5D8]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#CED5D8]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <p className="text-xs !ml-2 font-semibold">2 mins ago</p>
                    </div>
                    <p className="text-sm mt-3">
                      The service was amazing. I never had to wait that long for
                      my food. The staff was friendly and attentive, and the
                      delivery was impressively prompt.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <img
                    src="https://avatars.githubusercontent.com/u/37795928?v=4"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="ml-3">
                    <h4 className="text-sm font-bold">Mark Adair</h4>
                    <div className="flex space-x-1 mt-1">
                      <svg
                        className="w-4 fill-[#facc15]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#facc15]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#facc15]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#CED5D8]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <svg
                        className="w-4 fill-[#CED5D8]"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                      </svg>
                      <p className="text-xs !ml-2 font-semibold">30 mins ago</p>
                    </div>
                    <p className="text-sm mt-3">
                      The service was amazing. I never had to wait that long for
                      my food. The staff was friendly and attentive, and the
                      delivery was impressively prompt.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-start  pt-20">
                <h5 className="font-bold text-2xl">Mentor Course</h5>
              </div>

              {/* <!-- ✅ Grid Section - Starts Here 👇 --> */}
              <div
                id="Projects"
                className=" mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-10 mt-5 mb-5">
                <div className=" course-main w-64 bg-white shadow-md rounded-xl duration-500  hover:shadow-xl">
                  <Link href="">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" width={1000} height={1000}
                      alt="Product"
                      className="h-64 w-64 object-cover rounded-t-xl"
                    />
                    <div className="relative bg-white rounded-xl course-text2 px-4 py-3 w-64">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        5:00 Hours
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        Next JS Beginner Course
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          $149
                        </p>
                        <del>
                          <p className="text-sm text-gray-600 cursor-auto ml-2">
                            $199
                          </p>
                        </del>
                        <div className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16">
                            <path
                              clipRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className=" preview-text absolute  text-center pt-2 pb-4">
                        <h4 className="bg-purple-400 text-white  rounded-full font-bold px-2 py-2">
                          Preview This Course
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className=" course-main w-64 bg-white shadow-md rounded-xl duration-500  hover:shadow-xl">
                  <Link href="">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" width={1000} height={1000}
                      alt="Product"
                      className="h-64 w-64 object-cover rounded-t-xl"
                    />
                    <div className="relative bg-white rounded-xl course-text2 px-4 py-3 w-64">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        5:00 Hours
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        Next JS Beginner Course
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          $149
                        </p>
                        <del>
                          <p className="text-sm text-gray-600 cursor-auto ml-2">
                            $199
                          </p>
                        </del>
                        <div className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16">
                            <path
                              clipRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className=" preview-text absolute  text-center pt-2 pb-4">
                        <h4 className="bg-purple-400 text-white  rounded-full font-bold px-2 py-2">
                          Preview This Course
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className=" course-main w-64 bg-white shadow-md rounded-xl duration-500  hover:shadow-xl">
                  <Link href="">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" width={1000} height={1000}
                      alt="Product"
                      className="h-64 w-64 object-cover rounded-t-xl"
                    />
                    <div className="relative bg-white rounded-xl course-text2 px-4 py-3 w-64">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        5:00 Hours
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        Next JS Beginner Course
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          $149
                        </p>
                        <del>
                          <p className="text-sm text-gray-600 cursor-auto ml-2">
                            $199
                          </p>
                        </del>
                        <div className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16">
                            <path
                              clipRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className=" preview-text absolute  text-center pt-2 pb-4">
                        <h4 className="bg-purple-400 text-white  rounded-full font-bold px-2 py-2">
                          Preview This Course
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className=" course-main w-64 bg-white shadow-md rounded-xl duration-500  hover:shadow-xl">
                  <Link href="">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" width={1000} height={1000}
                      alt="Product"
                      className="h-64 w-64 object-cover rounded-t-xl"
                    />
                    <div className="relative bg-white rounded-xl course-text2 px-4 py-3 w-64">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        5:00 Hours
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        Next JS Beginner Course
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          $149
                        </p>
                        <del>
                          <p className="text-sm text-gray-600 cursor-auto ml-2">
                            $199
                          </p>
                        </del>
                        <div className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16">
                            <path
                              clipRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className=" preview-text absolute  text-center pt-2 pb-4">
                        <h4 className="bg-purple-400 text-white  rounded-full font-bold px-2 py-2">
                          Preview This Course
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className=" course-main w-64 bg-white shadow-md rounded-xl duration-500  hover:shadow-xl">
                  <Link href="">
                    <Image
                      src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" width={1000} height={1000}
                      alt="Product"
                      className="h-64 w-64 object-cover rounded-t-xl"
                    />
                    <div className="relative bg-white rounded-xl course-text2 px-4 py-3 w-64">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        5:00 Hours
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        Next JS Beginner Course
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          $149
                        </p>
                        <del>
                          <p className="text-sm text-gray-600 cursor-auto ml-2">
                            $199
                          </p>
                        </del>
                        <div className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16">
                            <path
                              clipRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className=" preview-text absolute  text-center pt-2 pb-4">
                        <h4 className="bg-purple-400 text-white  rounded-full font-bold px-2 py-2">
                          Preview This Course
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className=" course-main w-64 bg-white shadow-md rounded-xl duration-500  hover:shadow-xl">
                  <Link href="">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1000/1*v3XndYeIsBtk4CkpMf7vmA.jpeg" width={1000} height={1000}
                      alt="Product"
                      className="h-64 w-64 object-cover rounded-t-xl"
                    />
                    <div className="relative bg-white rounded-xl course-text2 px-4 py-3 w-64">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        5:00 Hours
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        Next JS Beginner Course
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          $149
                        </p>
                        <del>
                          <p className="text-sm text-gray-600 cursor-auto ml-2">
                            $199
                          </p>
                        </del>
                        <div className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16">
                            <path
                              clipRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className=" preview-text absolute  text-center pt-2 pb-4">
                        <h4 className="bg-purple-400 text-white  rounded-full font-bold px-2 py-2">
                          Preview This Course
                        </h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-2xl pt-8">Similar Mentors</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <img
                      src="https://avatars.githubusercontent.com/u/37795928?v=4"
                      className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div className="ml-3">
                      <h4 className="text-sm font-bold">John Doe</h4>
                      <h5>Software Engineer</h5>
                      <div className="flex flex-col md:flex-row lg:flex-row space-x-1 mt-1">
                        <p className="text-sm font-semibold">Javascript,</p>
                        <p className="text-sm lg:ml-2  font-semibold">React,</p>
                        <p className="text-sm lg:ml-2 font-semibold">
                          Next js,
                        </p>
                        <p className="text-sm lg:ml-2 font-semibold">
                          Node js,
                        </p>
                        <p className="text-sm lg:ml-2  font-semibold">React,</p>
                        <p className="text-sm lg:ml-2 font-semibold">
                          Next js,
                        </p>
                        <p className="text-sm lg:ml-2 font-semibold">Node js</p>
                      </div>
                      <p className="text-sm mt-3">From: $200/month</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      src="https://avatars.githubusercontent.com/u/37795928?v=4"
                      className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div className="ml-3">
                      <h4 className="text-sm font-bold">John Doe</h4>
                      <h5>Software Engineer</h5>
                      <div className="flex flex-col md:flex-row lg:flex-row space-x-1 mt-1">
                        <p className="text-sm font-semibold">Javascript,</p>
                        <p className="text-sm lg:ml-2  font-semibold">React,</p>
                        <p className="text-sm lg:ml-2 font-semibold">
                          Next js,
                        </p>
                        <p className="text-sm lg:ml-2 font-semibold">
                          Node js,
                        </p>
                        <p className="text-sm lg:ml-2  font-semibold">React,</p>
                        <p className="text-sm lg:ml-2 font-semibold">
                          Next js,
                        </p>
                        <p className="text-sm lg:ml-2 font-semibold">Node js</p>
                      </div>
                      <p className="text-sm mt-3">From: $200/month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}