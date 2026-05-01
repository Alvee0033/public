"use client";

import { Award, Code, Cpu, DollarSign, Users, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// export const metadata = {
//     title: "ScholarPASS | ScholarPASS - Tutoring with LearningART AI Platform",
//     description: "ScholarPASS | ScholarPASS - Tutoring with LearningART AI Platform",
// };

const Page = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleAccordion = (item) => {
    setOpenItem(openItem === item ? null : item);
  };
  return (
    <>
      <section className="p-6 bg-white ">
        <main className="container flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                    Unlock Your Future with ScholarPASS
                  </h1>
                  <p className="mx-auto max-w-[700px] text-white md:text-xl">
                    K12 Courses, Coding and Robotics Classes. Empowering
                    Students with Affordable Education!
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <Link
                    href="/scholarship-application"
                    className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg inline-block text-center"
                  >
                    Apply Now
                  </Link>
                  <button className="bg-transparent border-white border text-white hover:bg-white hover:text-purple-600 px-4 py-2 rounded-lg">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Program Benefits Section */}
          <section
            id="program-benefits"
            className="w-full pt-12 md:pt-24 lg:pt-32"
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
                ScholarsPASS Program Highlights & Benefits
              </h2>
              <div className="space-y-4">
                <p className="text-gray-500">
                  ScholarPASS ScholarsPASS is a comprehensive scholarship
                  program designed to make education accessible and affordable
                  for all K-12 students. By covering a significant portion of
                  course fees, ScholarsPASS ensures that financial constraints
                  do not stand in the way of academic success.
                </p>
              </div>
              <br />
              <br />
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                  <Code className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-bold">Academic K12 Courses</h3>
                  <p className="text-center text-gray-500">
                    Comprehensive K12 curriculum covering all core subjects and
                    electives.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                  <Cpu className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-bold">
                    Coding & Robotics Workshops
                  </h3>
                  <p className="text-center text-gray-500">
                    Build and program robots, exploring the intersection of
                    hardware and software.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                  <Zap className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-bold">Hands-on Projects</h3>
                  <p className="text-center text-gray-500">
                    Apply your skills to real-world projects and build an
                    impressive portfolio.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                  <DollarSign className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-bold">Maximum Fees Covered</h3>
                  <p className="text-center text-gray-500">
                    Scholarships cover the majority of course fees, making
                    quality education accessible.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                  <Users className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-bold">Expert 1:1 Tutors</h3>
                  <p className="text-center text-gray-500">
                    Access to volunteer tutors and experienced professionals in
                    various fields.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                  <Award className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-bold">Certification</h3>
                  <p className="text-center text-gray-500">
                    Earn certificates to showcase your newly acquired skills.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* How It Works Section */}
          <section className="w-full py-12 md:py-24 lg:py-24">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-24">
                How It Works
              </h2>
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 mt-16">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Apply</h3>
                  <p className="text-center text-gray-500">
                    Submit your application online or through your school.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Get Approved</h3>
                  <p className="text-center text-gray-500">
                    We will review your application and notify you of
                    acceptance.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Enroll</h3>
                  <p className="text-center text-gray-500">
                    Choose your courses and set up your learning schedule.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                    4
                  </div>
                  <h3 className="text-xl font-bold">Start Learning</h3>
                  <p className="text-center text-gray-500">
                    Begin your journey into the world of coding and robotics!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            id="faq"
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="w-full max-w-3xl mx-auto space-y-4">
                {/* Accordion Item 1 */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left text-lg font-semibold text-gray-800 p-4 bg-white"
                    onClick={() => toggleAccordion(1)}
                  >
                    Who is eligible for ScholarPASS?
                  </button>
                  {openItem === 1 && (
                    <div className="pl-4 pr-4 pb-4 text-gray-500 bg-gray-50">
                      ScholarPASS is available to all K-12 students. We aim to
                      provide opportunities to students from diverse
                      backgrounds, with a focus on those who might not otherwise
                      have access to such programs.
                    </div>
                  )}
                </div>

                {/* Accordion Item 2 */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left text-lg font-semibold text-gray-800 p-4 bg-white"
                    onClick={() => toggleAccordion(2)}
                  >
                    How much does it cost?
                  </button>
                  {openItem === 2 && (
                    <div className="pl-4 pr-4 pb-4 text-gray-500 bg-gray-50">
                      ScholarPASS covers the course fees for eligible students.
                      The program itself is free for accepted applicants.
                    </div>
                  )}
                </div>

                {/* Accordion Item 3 */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left text-lg font-semibold text-gray-800 p-4 bg-white"
                    onClick={() => toggleAccordion(3)}
                  >
                    What courses are offered?
                  </button>
                  {openItem === 3 && (
                    <div className="pl-4 pr-4 pb-4 text-gray-500 bg-gray-50">
                      We offer a variety of coding and robotics courses suitable
                      for different age groups and skill levels. This includes
                      introductory programming, web development, app creation,
                      and hands-on robotics workshops.
                    </div>
                  )}
                </div>

                {/* Accordion Item 4 */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left text-lg font-semibold text-gray-800 p-4 bg-white"
                    onClick={() => toggleAccordion(4)}
                  >
                    How long are the courses?
                  </button>
                  {openItem === 4 && (
                    <div className="pl-4 pr-4 pb-4 text-gray-500 bg-gray-50">
                      Course lengths vary depending on the subject and
                      complexity. Typically, our courses run for 8-12 weeks,
                      with classes held once or twice a week.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="w-full py-12 md:py-24 lg:py-32 bg-purple-500 rounded-lg"
          >
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                    Ready to Get Started?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Apply now for ScholarPASS and take the first step towards an
                    exciting future in technology!
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex flex-col gap-2">
                    <input
                      className="bg-white px-4 py-2 rounded-lg"
                      placeholder="Your Name"
                    />
                    <input
                      className="bg-white px-4 py-2 rounded-lg"
                      type="email"
                      placeholder="Your Email"
                    />
                    <button
                      className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                      type="submit"
                    >
                      Apply Now
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>
    </>
  );
};

export default Page;
