import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle, Target } from "lucide-react";

export default function PopularLearningGoalsSection() {
  const [learningGoals, setLearningGoals] = useState([]);

  useEffect(() => {
    async function fetchLearningGoals() {
      try {
        const res = await axios.get("/master-learning-goals");
        setLearningGoals(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching /master-learning-goals:", err);
      }
    }
    fetchLearningGoals();
  }, []);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-4">
              Popular Learning Goals
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what thousands of students are achieving with ScholarPASS
          </p>
        </div>

        {/* Learning Goals Cards */}
        {learningGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-lg">
            <AlertCircle className="h-8 w-8 mb-2" />
            <div>No learning goals found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
            {learningGoals.map((goal) => (
              <Card
                key={goal.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Icon and Title Row */}
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="text-blue-600 w-7 h-7 flex-shrink-0" />
                    <h3
                      className="text-xl font-bold text-gray-800 flex-1 line-clamp-2 min-h-[2.75rem]"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.75rem", // Ensures 2 lines space even if 1 line
                      }}
                    >
                      {goal.goal_title}
                    </h3>
                  </div>
                  {/* Description */}
                  <p
                    className="text-gray-600 mb-6 text-sm leading-relaxed flex items-start line-clamp-2 min-h-[2.5rem]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.5rem", // Ensures 2 lines space even if 1 line
                    }}
                  >
                    {goal.description?.trim() ? (
                      goal.description
                    ) : (
                      <span className="italic text-gray-400">
                        No description available.
                      </span>
                    )}
                  </p>
                  {/* Button */}
                  <Link href="/courses" className="mt-auto">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                      Explore Courses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
