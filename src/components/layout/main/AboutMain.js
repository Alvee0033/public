import eduEcosystem from "@/assets/images/about/edu_ecosystem.png";
import Image from "next/image";

const AboutMain = () => {
  return (
    <>
      {/* <HeroPrimary title="About Page" path={"About Page"} /> */}

      {/* About Section with Tailwind */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-left mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">About ScholarPASS</h1>
          <h2 className="text-xl text-gray-600 text-center">
            Revolutionizing the Future of Learning Through AI, Live Educators, and Universal Access
          </h2>
        </div>

        <div className="space-y-6 mb-12 text-left">
          <p className="text-gray-700">
            ScholarPASS is a global education movement built to solve one of the most critical challenges of our time:
            delivering personalized, high-quality learning to every child—regardless of their background, income level,
            or location. Our platform blends advanced AI technology, certified human tutors, and scholarship-backed
            access into a unified, scalable solution for K–12 education.
          </p>
          <p className="text-gray-700">
            At our core, we believe that every student deserves a fair shot at success. Our mission is to bridge the gap
            between affordability and excellence by removing barriers and delivering a world-class educational experience
            to every learner.
          </p>
          <p className="text-gray-700">
            ScholarPASS is more than just a platform—it&apos;s a global ecosystem of opportunity, empowerment, and innovation
            designed to uplift students, create jobs, and transform communities.
          </p>

          <Image
            src={eduEcosystem}
            alt=""
            className="w-[800px] object-cover mx-auto mb-10"
          />
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-left">What Makes ScholarPASS Different</h2>

          <div className="space-y-8">
            {/* Feature Cards */}
            {[
              {
                icon: "🌟",
                title: "Live Tutoring with Certified Educators",
                content: [
                  "We combine the irreplaceable value of real human interaction with the intelligence of modern technology. Students receive one-on-one and small-group tutoring from certified educators trained in evidence-based teaching strategies. From foundational K–12 subjects to advanced areas like SAT/ACT prep, coding, robotics, and AI—our tutors personalize each session to meet learners exactly where they are.",
                  "Tutors are sourced from a global talent pool, including the U.S., South Asia, Latin America, and Africa, ensuring diverse representation and 24/7 availability."
                ],
                borderColor: "border-red-500"
              },
              {
                icon: "🧠",
                title: "LearningART – Our AI-Powered Learning Platform",
                content: [
                  "LearningART, our proprietary LMS, drives a personalized learning journey for each student. The platform starts by understanding a student's goals and current level, then builds a structured learning path using multi-layered assessments, interactive lessons, smart quizzes, and real-time feedback.",
                  "Whether a student prefers self-paced learning, hands-on labs, or live tutoring, LearningART adapts dynamically—fostering not just academic mastery, but confidence, independence, and joy in learning."
                ],
                borderColor: "border-green-500"
              },
              {
                icon: "🎓",
                title: "ScholarPASS – Making Education Affordable for All",
                content: [
                  "ScholarPASS is our fully automated scholarship platform that ensures no student is held back due to cost. It brings together corporate CSR programs, philanthropic donors, educational grants, and individual contributions to fund tuition, tutoring, and course materials.",
                  "Through transparent application processes and impact tracking, we ensure that donor contributions go directly toward student learning—with maximum accountability and zero red tape. ScholarPASS also provides dedicated pathways for children of employee sponsors and nonprofit partners."
                ],
                borderColor: "border-yellow-500"
              },
              {
                icon: "🌍",
                title: "LearningHub – A Marketplace for Global Learning Opportunities",
                content: [
                  "The ScholarPASS LearningHub connects students to top-tier educational providers both locally and globally. Whether it's a local learning lab, a regional tutoring center, or a prestigious online program, LearningHub curates quality education and makes it discoverable to families everywhere.",
                  "Each partner is carefully vetted for instructional quality, inclusivity, and alignment with ScholarPASS's mission. Learners are matched to opportunities that fit their goals—backed by scholarships and progress tracked through LearningART."
                ],
                borderColor: "border-blue-500"
              },
              {
                icon: "🛒",
                title: "ScholarPASS Store – Enabling Hands-On Discovery",
                content: [
                  "Learning doesn't stop at the screen. Our Store offers school supplies, STEM kits, robotics tools, and hands-on learning accessories that are aligned with ScholarPASS courses. These resources enable students to engage in real-world experimentation and creative exploration—whether in class, at home, or in learning labs.",
                  "We also work directly with schools and learning centers to supply bulk educational kits and equipment for use in classrooms and labs."
                ],
                borderColor: "border-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className={`bg-gray-50 p-6 rounded-lg border-l-4 ${feature.borderColor}`}>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{feature.icon} {feature.title}</h3>
                {feature.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-700 mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Why Families, Schools, and Donors Trust ScholarPASS</h2>
          <ul className="space-y-4 mx-auto">
            {[
              "Personalized & Adaptive Learning: Every student receives a fully tailored academic plan, guided by real educators and optimized by AI.",
              "Financial Accessibility: With ScholarPASS, families can access scholarships that cover most or all educational costs.",
              "Certified Tutors: Our educators are carefully selected, continuously trained, and equipped to deliver results using proven learning science.",
              "End-to-End Ecosystem: From digital learning tools to hands-on kits, we provide everything a student needs to succeed—within a single platform.",
              "Global Vision, Local Impact: ScholarPASS operates globally but remains deeply rooted in each local community we serve, adapting to cultural and academic contexts."
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 text-xl mr-2">•</span>
                <span className="text-gray-700"><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12 text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Social Impact</h2>
          <p className="text-gray-700 mb-6 mx-auto">
            At ScholarPASS, education is a tool for equity, empowerment, and transformation. Our work is guided by a deep
            sense of purpose and a measurable commitment to social good.
          </p>
          <ul className="space-y-4 mx-auto">
            {[
              "Access for All: We ensure that children in underserved and marginalized communities receive the same level of support and opportunity as their peers.",
              "Empowering Women: Through tutoring franchises and EdTech partnerships, we help thousands of women launch and lead education businesses, giving them financial independence and leadership opportunities.",
              "Job Creation & Global Workforce Development: We are building a distributed workforce of tens of thousands of tutors, curriculum specialists, and digital educators—creating dignified employment across multiple countries.",
              "Supporting Minority Entrepreneurs: Our franchise model helps local leaders and educators build their own tutoring businesses with technology, training, and operational support from ScholarPASS.",
              "Measurable Impact: We monitor student progress in real time, enabling tutors, parents, and funders to see academic gains, engagement levels, and learning milestones with transparency and trust."
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 text-xl mr-2">•</span>
                <span className="text-gray-700"><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Commitment</h2>
          <p className="text-gray-700 mb-8 mx-auto">
            ScholarPASS is built for the long haul. As the world continues to shift toward hybrid and digital learning
            models, we remain committed to our founding principles:
          </p>

          <div className="pl-5 text-gray-700 mb-4">
            <li className="font-bold">Empowerment through Education</li>
            <li className="font-bold">Equity Through Access</li>
            <li className="font-bold">Excellence through Innovation</li>
          </div>



          <p className="italic text-gray-700 mb-6 mx-auto">
            Together, with our tutors, partners, donors, and communities, we&apos;re shaping a world where every learner has
            the tools, support, and opportunity to thrive—no matter where they begin.
          </p>
          <p className="font-bold text-gray-800 text-lg">
            Join us in reimagining education—not just for today, but for generations to come.
          </p>
        </div>
      </section>

      {/* <Overview />
      <FeatureCourses
        title={
          <>
            Choose The Best Package <br />
            For your Learning
          </>
        }
        course="2"
        subTitle="Popular Courses"
      />
      <Testimonials />
      <Brands /> */}
    </>
  );
};

export default AboutMain;
