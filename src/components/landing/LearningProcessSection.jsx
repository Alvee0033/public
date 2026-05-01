import { Card, CardContent } from "@/components/ui/card";

export default function LearningProcessSection() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <span className="text-3xl not-italic">🚀</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How ScholarPASS Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our proven 4-step process to accelerate your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h4 className="text-lg font-bold text-blue-600 mb-3">
                Assessment
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Comprehensive skill evaluation</li>
                <li>• Identify strengths and weaknesses</li>
                <li>• Set personalized learning objectives</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h4 className="text-lg font-bold text-green-600 mb-3">
                Planning
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create customized learning roadmap</li>
                <li>• Select optimal courses and resources</li>
                <li>• Schedule tutoring and study sessions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h4 className="text-lg font-bold text-purple-600 mb-3">
                Learning
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Access interactive course content</li>
                <li>• Participate in live tutoring sessions</li>
                <li>• Complete hands-on projects and labs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
                4
              </div>
              <h4 className="text-lg font-bold text-red-600 mb-3">Tracking</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  • Implement the recommended learning plan with live guidance
                </li>
                <li>
                  • Execute the tailored learning plan with continuous support
                </li>
                <li>• Continuously track progress and adapt the plan</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
