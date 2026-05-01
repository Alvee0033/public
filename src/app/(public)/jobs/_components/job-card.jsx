import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, FileText, Building, Briefcase, Share2, Heart, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useMemo } from "react"
import Link from "next/link"

// Constants
const APPLICATION_STATUSES = {
  APPLIED: "applied",
  INTERVIEW: "interview", 
  CLOSED: "closed"
}

// Custom hook for job data transformation
const useJobData = (job) => {
  return useMemo(() => ({
    title: job?.title || "No Title",
    company: job?.company?.name || "Unknown Company",
    location: `${job?.city || ""}, ${job?.country?.name || ""}`.replace(/^, |, $/, '') || "Remote",
    jobType: job?.full_time_job_or_gig_work ? "Full-time" : "Contract",
    jobId: job?.id || "",
    salary: job?.salary_info || "Not specified",
    publishedDate: job?.created_at ? new Date(job?.created_at).toLocaleDateString("en-US",
      { year: 'numeric', month: 'short', day: 'numeric' }
    ) : "",
    category: job?.job_category?.name || "General",
    experience: `${job?.minimum_experience || 0}-${job?.maximum_experience || 0} years`,
    rewardPoints: job?.referral_points || 0
  }), [job])
}

// Component for detailed job info
const DetailedJobInfo = ({ category, experience, salary, publishedDate }) => (
  <div className="mt-1 space-y-0.5 text-xs text-gray-500">
    <div className="flex items-center gap-1">
      <Tag size={10} />
      <p>{category} • {experience}</p>
    </div>
    <div className="flex items-center gap-1">
      <DollarSign size={10} />
      <p>{salary}</p>
    </div>
    <div className="flex items-center gap-1">
      <Clock size={10} />
      <p>Published: {publishedDate}</p>
    </div>
  </div>
)

// Component for basic job info
const BasicJobInfo = ({ publishedDate }) => (
  <div className="mt-1 text-xs text-gray-500">
    <div className="flex items-center gap-1">
      <Clock size={10} />
      <p>Published: {publishedDate}</p>
    </div>
  </div>
)

// Component for application progress buttons
const ApplicationProgress = ({ applicationProgress = 0 }) => {
  const progressSteps = [
    { label: "Applied", step: 1 },
    { label: "Interview", step: 2 },
    { label: "Offer", step: 3 }
  ]

  return (
    <div className="flex gap-1">
      {progressSteps.map(({ label, step }) => (
        <Button
          key={label}
          className={`px-2 py-1 h-6 rounded text-xs ${
            applicationProgress >= step 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

// Component for action buttons
const ActionButtons = ({ jobId, isDetailedCard }) => (
  <div className="flex items-center gap-2">
    {isDetailedCard ? (
      <ApplicationProgress />
    ) : (
      <>
        <Link href={`/jobs/${jobId}`} passHref>
          <Button className="px-3 py-1 h-6 bg-green-600 hover:bg-green-700 text-white text-xs">
            Apply
          </Button>
        </Link>
        <Button className="px-3 py-1 h-6 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          Refer
        </Button>
      </>
    )}
  </div>
)

// Component for social buttons (like/share)
const SocialButtons = ({ liked, setLiked, isDetailedCard }) => (
  <div className="flex items-center gap-0.5">
    <Button
      variant="ghost"
      size="icon"
      className={`h-6 w-6 ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
      onClick={() => setLiked(!liked)}
    >
      <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
    </Button>
    <Button 
      variant="ghost" 
      size="icon" 
      className={`h-6 w-6 ${isDetailedCard ? "text-blue-500" : "text-gray-400"}`}
    >
      <Share2 className="h-3 w-3" />
    </Button>
  </div>
)

export function JobCard({ job, number, status }) {
  const [liked, setLiked] = useState(false)
  const jobData = useJobData(job)
  
  const isDetailedCard = Object.values(APPLICATION_STATUSES).includes(status)
  
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="relative overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
        {number && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-medium rounded w-4 h-4 flex items-center justify-center">
            {number}
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-3">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-1 mb-1">
              <FileText size={16} className="text-blue-600" />
              {jobData.title}
            </h2>

            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Building size={12} className="text-gray-400" />
              <p>{jobData.company}</p>
            </div>

            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin size={12} className="text-gray-400" />
              <p>{jobData.location}</p>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <Briefcase size={12} className="text-gray-400" />
              <p>{jobData.jobType}</p>
            </div>

            {isDetailedCard ? (
              <DetailedJobInfo {...jobData} />
            ) : (
              <BasicJobInfo jobId={jobData.jobId} publishedDate={jobData.publishedDate} />
            )}
          </div>

          <div className="w-full md:w-[100px] bg-blue-600 text-white p-2 flex flex-col items-center justify-center">
            <div className="text-xl font-semibold">
              ${jobData.rewardPoints}
            </div>
            <div className="text-xs text-center opacity-90">Reward</div>
          </div>
        </div>

        <div className="p-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <ActionButtons jobId={jobData.jobId} isDetailedCard={isDetailedCard} />
            <SocialButtons liked={liked} setLiked={setLiked} isDetailedCard={isDetailedCard} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
