import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Heart, GraduationCap, Award } from "lucide-react"

export function TutorOpportunities() {
  return (
    (<Card className="bg-gradient-to-r from-green-100 to-blue-100">
      <CardHeader>
        <CardTitle className="text-2xl text-green-800">Join Our Tutoring Team</CardTitle>
        <CardDescription className="text-green-700">
          Empower the next generation of learners while growing your skills
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <Briefcase className="h-10 w-10 text-blue-500 mr-4" />
          <div>
            <h4 className="font-semibold text-lg">Full-Time Tutor Positions</h4>
            <p className="text-sm text-gray-600">Join us in shaping young minds full-time</p>
          </div>
          <Button className="ml-auto" variant="outline">
            Apply Now
          </Button>
        </div>
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <Heart className="h-10 w-10 text-red-500 mr-4" />
          <div>
            <h4 className="font-semibold text-lg">Volunteer Tutoring</h4>
            <p className="text-sm text-gray-600">Make a difference in your community</p>
          </div>
          <Button className="ml-auto" variant="outline">
            Learn More
          </Button>
        </div>
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <GraduationCap className="h-10 w-10 text-purple-500 mr-4" />
          <div>
            <h4 className="font-semibold text-lg">Student Tutor Program</h4>
            <p className="text-sm text-gray-600">Encourage your senior kids to become tutors</p>
          </div>
          <Button className="ml-auto" variant="outline">
            Enroll
          </Button>
        </div>
        <div className="bg-green-200 p-4 rounded-lg mt-4">
          <h4 className="font-semibold flex items-center">
            <Award className="h-5 w-5 mr-2 text-green-700" />
            ScholarPASS Certification
          </h4>
          <p className="text-sm text-green-800 mt-1">
            We provide comprehensive training and certification for all our tutors, ensuring the highest quality of
            education for our students.
          </p>
        </div>
      </CardContent>
    </Card>)
  );
}

