import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "Learning Goals",
    description: "Define short-term goals and identify long-term objectives.",
    details: [
      "Set achievable short-term goals (e.g., improving grades)",
      "Outline long-term objectives (e.g., college preparation, career growth)",
      "Align personal interests with academic pursuits",
    ],
  },
  {
    title: "Assessment",
    description:
      "Conduct a thorough evaluation of strengths, challenges, and preferences.",
    details: [
      "Complete comprehensive subject-specific quizzes",
      "Participate in one-on-one interviews with education specialists",
      "Take adaptive online exams to identify areas for improvement",
    ],
  },
  {
    title: "Recommendations",
    description:
      "Provide a tailored learning plan based on assessment results.",
    details: [
      "Design customized course structures with detailed modules",
      "Suggest optimal learning methods (e.g., one-on-one tutoring, group sessions)",
      "Match with tutors based on expertise, teaching style, and availability",
    ],
  },
  {
    title: "Training",
    description:
      "Implement the personalized training plan with clear milestones.",
    details: [
      "Execute the tailored learning plan with defined checkpoints",
      "Offer ongoing support through structured sessions",
      "Continuously track progress and adapt the plan using AI insights",
    ],
  },
];

const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];

export default function LearningArtSteps() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">
          4 Steps of LearningART Methodology
        </h2>
        <p className="mb-12 max-w-2xl">
          ScholarPASS's proprietary AI technology, LearningART, transforms
          education through a 4-step methodology developed after years of
          analyzing educational processes. Our innovative platform ensures that
          each student's unique learning style, goals, and challenges are
          addressed, making learning personal, efficient, and impactful.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="w-full embossed">
              <CardHeader
                className={`${colors[index]} text-white rounded-t-lg`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold mr-3">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {step.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm py-6  text-gray-600">
                <p className="mb-2">{step.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
