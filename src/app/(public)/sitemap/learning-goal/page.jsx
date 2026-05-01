"use client"
import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Clock, Users, ChevronRight, TrendingUp, CheckCircle, Award } from "lucide-react"

// Mock data for learning goals
const learningGoalsData = [
  {
    id: 1,
    title: "Master Full-Stack Web Development",
    description: "Become proficient in both frontend and backend technologies to build complete web applications",
    duration: "6 months",
    progress: 45,
    difficulty: "Advanced",
    category: "Web Development",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    learners: 1840,
    status: "In Progress",
    prerequisites: "Basic HTML, CSS, JavaScript",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Data Science Career Transition",
    description: "Complete roadmap to transition into a data science career with hands-on projects",
    duration: "8 months",
    progress: 0,
    difficulty: "Intermediate",
    category: "Data Science",
    skills: ["Python", "Pandas", "Machine Learning", "Statistics"],
    learners: 920,
    status: "Not Started",
    prerequisites: "Basic programming knowledge",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Mobile App Development Mastery",
    description: "Learn to build native and cross-platform mobile applications from scratch",
    duration: "5 months",
    progress: 78,
    difficulty: "Intermediate",
    category: "Mobile Development",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    learners: 1250,
    status: "In Progress",
    prerequisites: "JavaScript fundamentals",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "UI/UX Design Professional",
    description: "Develop comprehensive design skills to create user-centered digital experiences",
    duration: "4 months",
    progress: 100,
    difficulty: "Beginner",
    category: "Design",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    learners: 2100,
    status: "Completed",
    prerequisites: "None",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Cloud Architecture Specialist",
    description: "Master cloud computing concepts and become proficient in AWS, Azure, and GCP",
    duration: "7 months",
    progress: 23,
    difficulty: "Advanced",
    category: "Cloud Computing",
    skills: ["AWS", "Docker", "Kubernetes", "Microservices"],
    learners: 680,
    status: "In Progress",
    prerequisites: "System administration basics",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Cybersecurity Expert Path",
    description: "Comprehensive journey to become a cybersecurity professional with practical skills",
    duration: "9 months",
    progress: 12,
    difficulty: "Advanced",
    category: "Cybersecurity",
    skills: ["Ethical Hacking", "Network Security", "Incident Response", "Risk Assessment"],
    learners: 450,
    status: "In Progress",
    prerequisites: "Networking fundamentals",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    title: "Digital Marketing Mastery",
    description: "Learn modern digital marketing strategies and tools to grow businesses online",
    duration: "3 months",
    progress: 89,
    difficulty: "Beginner",
    category: "Marketing",
    skills: ["SEO", "Social Media", "Content Marketing", "Analytics"],
    learners: 1560,
    status: "In Progress",
    prerequisites: "Basic computer skills",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    title: "Machine Learning Engineer",
    description: "Deep dive into ML algorithms, model deployment, and production systems",
    duration: "10 months",
    progress: 0,
    difficulty: "Advanced",
    category: "Artificial Intelligence",
    skills: ["TensorFlow", "PyTorch", "MLOps", "Deep Learning"],
    learners: 340,
    status: "Not Started",
    prerequisites: "Python, Statistics, Linear Algebra",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 9,
    title: "DevOps Engineering Path",
    description: "Master the tools and practices for continuous integration and deployment",
    duration: "6 months",
    progress: 56,
    difficulty: "Intermediate",
    category: "DevOps",
    skills: ["Jenkins", "Git", "Linux", "Infrastructure as Code"],
    learners: 780,
    status: "In Progress",
    prerequisites: "Basic programming and system administration",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 10,
    title: "Blockchain Developer Journey",
    description: "Learn blockchain technology and smart contract development from fundamentals",
    duration: "8 months",
    progress: 34,
    difficulty: "Advanced",
    category: "Blockchain",
    skills: ["Solidity", "Web3", "Smart Contracts", "DeFi"],
    learners: 290,
    status: "In Progress",
    prerequisites: "Programming experience",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 11,
    title: "Product Management Excellence",
    description: "Develop skills to lead product development and strategy in tech companies",
    duration: "5 months",
    progress: 67,
    difficulty: "Intermediate",
    category: "Product Management",
    skills: ["Product Strategy", "User Research", "Agile", "Analytics"],
    learners: 1120,
    status: "In Progress",
    prerequisites: "Business fundamentals",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 12,
    title: "Game Development Mastery",
    description: "Create engaging games using modern engines and programming techniques",
    duration: "7 months",
    progress: 0,
    difficulty: "Intermediate",
    category: "Game Development",
    skills: ["Unity", "C#", "Game Design", "3D Modeling"],
    learners: 650,
    status: "Not Started",
    prerequisites: "Basic programming knowledge",
    image: "/placeholder.svg?height=200&width=300",
  },
]

/** @param {{goal: any, index: number}} props */
const GoalCard = ({ goal, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />
      case "In Progress":
        return <TrendingUp className="w-4 h-4" />
      case "Not Started":
        return <Target className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={goal.image}
          alt={goal.title}
          className="w-full h-48 object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-full p-3 shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </motion.div>
        </motion.div>
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              goal.difficulty === "Beginner"
                ? "bg-green-100 text-green-800"
                : goal.difficulty === "Intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {goal.difficulty}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            {goal.category}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white bg-opacity-90 rounded-lg p-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <motion.h3
            className="text-xl font-bold text-gray-900 line-clamp-2 flex-1"
            animate={{ color: isHovered ? "#2563eb" : "#111827" }}
            transition={{ duration: 0.2 }}
          >
            {goal.title}
          </motion.h3>
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(goal.status)}`}
          >
            {getStatusIcon(goal.status)}
            <span className="ml-1">{goal.status}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{goal.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{goal.learners.toLocaleString()} learners</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Key Skills:</p>
          <div className="flex flex-wrap gap-1">
            {goal.skills.slice(0, 3).map((skill, skillIndex) => (
              <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                {skill}
              </span>
            ))}
            {goal.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                +{goal.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-semibold text-gray-700">
              {goal.progress === 100 ? "Completed" : goal.progress > 50 ? "On Track" : "Getting Started"}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
              goal.status === "Completed"
                ? "bg-green-600 text-white hover:bg-green-700"
                : goal.status === "In Progress"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {goal.status === "Completed" ? "Review" : goal.status === "In Progress" ? "Continue" : "Start Goal"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function LearningGoalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredGoals, setFilteredGoals] = useState(learningGoalsData)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGoals(learningGoalsData)
    } else {
      const filtered = learningGoalsData.filter(
        (goal) =>
          goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          goal.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.status.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredGoals(filtered)
    }
  }, [searchTerm])

  const completedGoals = learningGoalsData.filter((goal) => goal.status === "Completed").length
  const inProgressGoals = learningGoalsData.filter((goal) => goal.status === "In Progress").length
  const averageProgress = Math.round(
    learningGoalsData.reduce((sum, goal) => sum + goal.progress, 0) / learningGoalsData.length,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Learning Goals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Set ambitious learning objectives and track your progress towards mastering new skills
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-md mx-auto relative"
            >
              <input
                type="text"
                placeholder="Search learning goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
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
              All Learning Goals
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full"
            />
            <span className="ml-4 text-gray-500 font-medium">({filteredGoals.length} goals)</span>
          </div>

          {filteredGoals.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No learning goals found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGoals.map((goal, index) => (
                <GoalCard key={goal.id} goal={goal} index={index} />
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white border-t"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-purple-600 mb-2">{learningGoalsData.length}</div>
              <div className="text-gray-600">Total Goals</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-green-600 mb-2">{completedGoals}</div>
              <div className="text-gray-600">Completed Goals</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-blue-600 mb-2">{inProgressGoals}</div>
              <div className="text-gray-600">In Progress</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-orange-600 mb-2">{averageProgress}%</div>
              <div className="text-gray-600">Average Progress</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
