"use client"
import { useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef } from "react"
import { 
  FileText, 
  Clock, 
  Users, 
  ChevronRight, 
  Target, 
  Award, 
  Calendar, 
  MapPin, 
  Monitor, 
  Building,
  Search,
  BookOpen,
  TrendingUp,
  Star,
  Filter,
  Grid3X3,
  List,
  Sparkles
} from "lucide-react"
import axios from "@/lib/axios"
import { format } from "date-fns"

/** @param {{exam: any, index: number, formatDateTime: function}} props */
const ExamCard = ({ exam, index, formatDateTime }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "from-emerald-400 to-emerald-600"
      case "Intermediate":
        return "from-amber-400 to-amber-600"
      case "Advanced":
        return "from-red-400 to-red-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getSuccessRating = (passRate) => {
    if (passRate >= 80) return { text: "High Success", color: "text-emerald-600", icon: "🏆" }
    if (passRate >= 70) return { text: "Good Success", color: "text-amber-600", icon: "⭐" }
    return { text: "Challenging", color: "text-red-600", icon: "🔥" }
  }

  const successRating = getSuccessRating(exam.passRate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(exam.difficulty)}`} />
      
      {/* Floating Difficulty Badge */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getDifficultyColor(exam.difficulty)} shadow-lg`}
        >
          {exam.difficulty}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <motion.h3
              className="text-xl font-bold text-gray-900 line-clamp-2 pr-4"
              animate={{ color: isHovered ? "#2563eb" : "#111827" }}
              transition={{ duration: 0.3 }}
            >
              {exam.title}
            </motion.h3>
          </div>
          
          {exam.exam_code && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200"
            >
              <BookOpen className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">{exam.exam_code}</span>
            </motion.div>
          )}
          
          <p className="text-gray-600 text-sm mt-3 line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="flex items-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Duration</p>
              <p className="text-sm font-bold text-blue-800">{exam.duration}</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-purple-500 rounded-lg">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-medium">Questions</p>
              <p className="text-sm font-bold text-purple-800">{exam.questions}</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-medium">Pass Score</p>
              <p className="text-sm font-bold text-emerald-800">{exam.passing_score}/{exam.total_score}</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-orange-500 rounded-lg">
              {exam.remote_or_onsite ? (
                <Monitor className="w-4 h-4 text-white" />
              ) : (
                <Building className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-xs text-orange-600 font-medium">Type</p>
              <p className="text-sm font-bold text-orange-800">
                {exam.remote_or_onsite ? "Remote" : "On-site"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <AnimatePresence>
          {!exam.remote_or_onsite && exam.onsite_exam_location_address && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-4"
            >
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 line-clamp-1">
                {exam.onsite_exam_location_address}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time Window */}
        {exam.start_date_time && exam.end_date_time && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-4"
          >
            <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="text-xs text-indigo-700">
              <p className="font-medium">Available:</p>
              <p className="line-clamp-1">
                {formatDateTime(exam.start_date_time)} - {formatDateTime(exam.end_date_time)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Success Rate & Attempts */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">{successRating.icon}</span>
            <div>
              <p className={`text-sm font-bold ${successRating.color}`}>
                {successRating.text}
              </p>
              <p className="text-xs text-gray-500">{exam.passRate}% pass rate</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{exam.attempts.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Start Exam
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating Particles Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: "100%",
                  scale: 0
                }}
                animate={{ 
                  y: "-10%",
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [examData, setExamData] = useState([])
  const [filteredExams, setFilteredExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Format date time helper function
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a")
    } catch (err) {
      return "Invalid Date"
    }
  }

  // Transform API exam data to match UI expectations
  const transformExamData = (apiExams) => {
    return apiExams.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description?.replace(/<[^>]*>/g, "") || "No description available",
      duration: `${exam.exam_duration_minutes || 0} minutes`,
      questions: exam.total_questions_to_appear || 0,
      attempts: Math.floor(Math.random() * 1000) + 100, // Mock data since not in API
      passRate: Math.floor(Math.random() * 40) + 60, // Mock data since not in API
      subject: exam.exam_code || "General",
      difficulty: exam.passing_score > 80 ? "Advanced" : exam.passing_score > 60 ? "Intermediate" : "Beginner",
      image: "/placeholder.svg?height=200&width=300", // Default placeholder
      exam_code: exam.exam_code,
      exam_duration_minutes: exam.exam_duration_minutes,
      total_questions_to_appear: exam.total_questions_to_appear,
      passing_score: exam.passing_score,
      total_score: exam.total_score,
      remote_or_onsite: exam.remote_or_onsite,
      onsite_exam_location_address: exam.onsite_exam_location_address,
      start_date_time: exam.start_date_time,
      end_date_time: exam.end_date_time
    }))
  }

  // Fetch exams from API on component mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Create query object similar to admin page
        const queryObject = {
          pagination: true,
          limit: 1000, // Set a high limit to get all exams
          skip: 0,
          sort: { id: -1 }, // Sort by ID descending
          filter: {},
          search: ""
        }
        
        // Build query string using the same logic as admin qString function
        const buildQueryString = (obj) => {
          const params = new URLSearchParams();
          
          for (const [key, value] of Object.entries(obj)) {
            if (
              typeof value === "object" &&
              value !== null &&
              Object.keys(value).length === 0
            ) {
              continue;
            }
            
            if (typeof value === "object" && value !== null) {
              params.set(key, JSON.stringify(value));
            } else if (value !== "") {
              params.set(key, value);
            }
          }
          
          return params.toString();
        }
        
        const queryString = buildQueryString(queryObject)
        const response = await axios.get(`/exams?${queryString}`)
        
        if (!response.data) {
          throw new Error("No data received")
        }
        
        const examsData = response.data?.data || []
        const transformedExams = transformExamData(examsData)
        setExamData(transformedExams)
        setFilteredExams(transformedExams)
      } catch (err) {
        console.error("Error details:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
        })
        setError(
          err?.response?.data?.message || err?.message || "Failed to load exams"
        )
        // Fallback to empty array if API fails
        setExamData([])
        setFilteredExams([])
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  // Filter exams based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredExams(examData)
    } else {
      const filtered = examData.filter(
        (exam) =>
          exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.difficulty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.exam_code?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredExams(filtered)
    }
  }, [searchTerm, examData])

  // Handle search - for now just filter locally, can be enhanced to use API search later
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/50 backdrop-blur-sm"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 left-1/3 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200/50 mb-6">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Discover Your Potential</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
                Available Exams
              </h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-6"
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Test your knowledge and earn certifications with our comprehensive exam collection. 
              <span className="text-blue-600 font-semibold"> Challenge yourself today!</span>
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                  <div className="flex items-center">
                    <div className="pl-6">
                      <Search className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for exams, topics, or difficulty levels..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 px-4 py-4 text-lg bg-transparent border-none focus:outline-none placeholder-gray-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mr-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Search
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">{examData.length}+</p>
                  <p className="text-sm text-gray-600">Available Exams</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">
                    {examData.length > 0 ? Math.round(examData.reduce((sum, exam) => sum + (exam.passRate || 0), 0) / examData.length) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">
                    {examData.length > 0 ? [...new Set(examData.map((exam) => exam.subject).filter(Boolean))].length : 0}+
                  </p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Exams Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center mb-8">
            <motion.h2
              className="text-3xl font-bold text-gray-900 mr-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              All Exams
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
            <span className="ml-4 text-gray-500 font-medium">({filteredExams.length} exams)</span>
          </div>

          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading exams...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest exams</p>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="text-red-500 w-16 h-16 mx-auto mb-4">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load exams</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : filteredExams.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam, index) => (
                <ExamCard key={exam.id || index} exam={exam} index={index} formatDateTime={formatDateTime} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
