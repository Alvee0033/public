import { Brain, DollarSign, Sparkles, Users } from "lucide-react";
import RainbowButton from "./RainbowButton";

export default function HeroSection() {
  const pillars = [
    {
      title: "LearningART AI Platform",
      description: "Personalized learning with advanced AI technology",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700",
      icon: <Brain className="w-14 h-14 text-blue-100" />,
    },
    {
      title: "Live Tutoring & Learning",
      description: "Connect with expert tutors in real-time",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-700",
      icon: <Users className="w-14 h-14 text-green-100" />,
    },
    {
      title: "ScholarPASS",
      description: "Access to exclusive scholarship opportunities",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-700",
      icon: <DollarSign className="w-14 h-14 text-purple-100" />,
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-semibold">
              Transform K-12 Student Learning Journey by combining - <br /> AI
              Learning Platform + Live Tutoring & ScholarPASS Scholarships
              Tutors + Scholarships
            </span>
          </div>

          {/* <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight mx-auto max-w-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              AI Technology + Live Tutors + Scholarships
            </span>

          </h1> */}
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${pillar.gradientFrom} ${pillar.gradientTo} p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="bg-white/10 p-4 rounded-xl inline-block mb-6">
                {pillar.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {pillar.title}
              </h2>
              <p className="text-white/80">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mb-8">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              All for Just $1-$2/Day unlimited tutoring. Yearly contract
              <p>Impacting k12 students in USA & Globally</p>
            </div>
          </div>
          <RainbowButton className=" bg-[length:100%]">
            Get Started Now <Sparkles className="w-5 h-5 ml-2" />
          </RainbowButton>
        </div>
      </div>
    </section>
  );
}
