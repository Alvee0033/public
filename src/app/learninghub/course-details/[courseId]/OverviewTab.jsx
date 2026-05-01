import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertCircle, Book, BrainCircuit, CheckCircle, Info, Sparkles, Target, Users, Video } from 'lucide-react'

// Safe HTML content renderer
function SafeHtmlContent({ content, fallback }) {
  if (!content) return fallback

  return <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-sm max-w-none" />
}

// Safe text content renderer (strips HTML)
function SafeTextContent({ content, fallback }) {
  if (!content) return fallback

  const extractText = (html) => {
    if (typeof window !== "undefined") {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = html
      return tempDiv.textContent || tempDiv.innerText || html
    }
    return html.replace(/<[^>]*>/g, "")
  }

  return <span>{extractText(content)}</span>
}

function NotFound({ text, icon: Icon = AlertCircle }) {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-6 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
      <Icon className="w-8 h-8 mb-2 text-muted-foreground/60" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/10 border-blue-200 text-blue-700",
    green: "from-green-500/10 to-green-600/10 border-green-200 text-green-700",
    purple: "from-purple-500/10 to-purple-600/10 border-purple-200 text-purple-700",
    orange: "from-orange-500/10 to-orange-600/10 border-orange-200 text-orange-700",
  }

  return (
    <Card
      className={`p-6 bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
    >
      <div className="text-center">
        <div className="mb-3">
          <Icon className="w-8 h-8 mx-auto text-current group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-current">
            {value ?? <span className="text-muted-foreground text-base">N/A</span>}
          </p>
          <p className="text-sm font-medium text-current/80">{label}</p>
        </div>
      </div>
    </Card>
  )
}

export default function OverviewTab({ course }) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 border">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
              Course Overview
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Description</h2>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <SafeHtmlContent
              content={course?.description}
              fallback={<NotFound text="Course description not available" icon={Info} />}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8 ">
        {/* Statistics Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-900">Course Statistics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Book} value={course?.number_of_book_lessons} label="Book Lessons" color="blue" />
            <StatCard icon={Video} value={course?.number_of_video_lessons} label="Video Lessons" color="green" />
            <StatCard icon={Users} value={course?.number_of_live_tutors_lessons} label="Live Sessions" color="purple" />
            <StatCard icon={BrainCircuit} value={course?.number_of_quizzes} label="Quizzes" color="orange" />
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Outcomes */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900">Learning Outcomes</h3>
            </div>
            <div className="prose prose-green prose-sm max-w-none">
              <SafeHtmlContent
                content={course?.course_outcome}
                fallback={<NotFound text="Learning outcomes not specified" icon={Target} />}
              />
            </div>
          </Card>


          {/* Prerequisites */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-all duration-300 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-900">Prerequisites</h3>
            </div>
            <div className="prose prose-amber prose-sm max-w-none text-amber-800">
              <SafeHtmlContent
                content={course?.course_pre_requisition}
                fallback={<NotFound text="No prerequisites specified" icon={Info} />}
              />
            </div>
          </Card>
        </div>

        {/* Instructor Guidelines */}
        {/* <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Info className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Instructor Guidelines</h3>
          </div>

          <div className="prose prose-sm max-w-none text-slate-600">
            <SafeHtmlContent
              content={course?.guideline_for_instructor}
              fallback={
                <div className="text-center py-4">
                  <Info className="w-6 h-6 mx-auto mb-2 text-muted-foreground/60" />
                  <span className="text-muted-foreground text-sm">No guidelines provided</span>
                </div>
              }
            />
          </div>
        </Card> */}
      </div>

    </div>
  )
}
