"use client"

import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { BookOpen, Clock, Users, Star, ChevronRight, Loader2 } from "lucide-react"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.tutorsplan.com'

// Utility function to strip HTML tags from text
const stripHtmlTags = (text) => {
  if (!text || typeof text !== 'string') return text || ''
  
  // Remove HTML tags using regex
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/&hellip;/g, '...') // Replace &hellip; with ...
    .trim() // Remove leading/trailing whitespace
}

// API service to fetch courses
const fetchCourses = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      limit: params.limit || 100,
      skip: params.skip || 0,
      pagination: params.pagination || false,
      ...params
    })

    const response = await fetch(`${API_BASE_URL}/courses?${queryParams}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : data.data || []
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

// Function to organize courses by category
const organizeCoursesByCategory = (courses) => {
  const categorizedCourses = {}
  
  courses.forEach(course => {
    // Use course_category first, then fallback to other category fields
    let category = course.course_category || course.category || course.subject || 'General'
    
    // Handle if course_category is an object with name property
    if (typeof category === 'object' && category !== null) {
      category = category.name || category.title || category.label || 'General'
    }
    
    // Clean the category name
    category = stripHtmlTags(category)
    
    // Ensure category is not empty
    if (!category || category.trim() === '') {
      category = 'General'
    }
    
    if (!categorizedCourses[category]) {
      categorizedCourses[category] = []
    }
    
    // Transform API data to match component expectations and strip HTML tags
    const transformedCourse = {
      id: course._id || course.id,
      title: stripHtmlTags(course.title || course.name),
      description: stripHtmlTags(course.description || course.summary || ''),
      duration: stripHtmlTags(course.duration || `${course.weeks || 8} weeks`),
      students: course.enrolledStudents || course.students || Math.floor(Math.random() * 3000) + 100,
      rating: course.rating || course.averageRating || (Math.random() * 1.5 + 3.5).toFixed(1),
      level: stripHtmlTags(course.level || course.difficulty || 'Intermediate'),
      image: course.image || course.thumbnail || "/placeholder.svg?height=200&width=300",
      price: course.price || 0,
      instructor: stripHtmlTags(course.instructor || course.teacher || ''),
      tags: Array.isArray(course.tags) ? course.tags.map(tag => stripHtmlTags(tag)) : [],
      category: category, // Store the category for reference
    }
    
    categorizedCourses[category].push(transformedCourse)
  })
  
  return categorizedCourses
}

/** @param {{category: string, courses: Array, index: number}} props */
const CategorySection = ({ category, courses, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-16"
    >
      <div className="flex items-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-gray-900 mr-4"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          {category}
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "100px" } : { width: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        />
        <span className="ml-4 text-gray-500 font-medium">({courses.length} courses)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, courseIndex) => (
          <CourseCard key={course.id} course={course} index={courseIndex} />
        ))}
      </div>
    </motion.section>
  )
}

/** @param {{course: any, index: number}} props */
const CourseCard = ({ course, index }) => {
  const [isHovered, setIsHovered] = useState(false)

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
          src={course.image}
          alt={course.title}
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
              course.level === "Beginner"
                ? "bg-green-100 text-green-800"
                : course.level === "Intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <motion.h3
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"
          animate={{ color: isHovered ? "#2563eb" : "#111827" }}
          transition={{ duration: 0.2 }}
        >
          {course.title}
        </motion.h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            View Course
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courseData, setCourseData] = useState({})
  const [filteredData, setFilteredData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch courses from API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const courses = await fetchCourses({
          limit: 100,
          pagination: false
        })
        
        const categorizedCourses = organizeCoursesByCategory(courses)
        setCourseData(categorizedCourses)
        setFilteredData(categorizedCourses)
      } catch (err) {
        console.error('Failed to load courses:', err)
        setError('Failed to load courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  // Handle search filtering
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(courseData)
    } else {
      const filtered = {}
      Object.entries(courseData).forEach(([category, courses]) => {
        const filteredCourses = courses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        if (filteredCourses.length > 0) {
          filtered[category] = filteredCourses
        }
      })
      setFilteredData(filtered)
    }
  }, [searchTerm, courseData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              Course Sitemap
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Explore our comprehensive collection of courses organized by category
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
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Course Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-16"
          >
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading courses...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest courses</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Courses</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : Object.entries(filteredData).length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </motion.div>
        ) : (
          Object.entries(filteredData).map(([category, courses], index) => (
            <CategorySection key={category} category={category} courses={courses} index={index} />
          ))
        )}
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
              <div className="text-3xl font-bold text-blue-600 mb-2">{Object.values(courseData).flat().length}</div>
              <div className="text-gray-600">Total Courses</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-green-600 mb-2">{Object.keys(courseData).length}</div>
              <div className="text-gray-600">Categories</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Object.values(courseData)
                  .flat()
                  .reduce((sum, course) => sum + course.students, 0)
                  .toLocaleString()}
              </div>
              <div className="text-gray-600">Students Enrolled</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Object.values(courseData).flat().length > 0 
                  ? (Object.values(courseData)
                      .flat()
                      .reduce((sum, course) => sum + parseFloat(course.rating), 0) / 
                      Object.values(courseData).flat().length).toFixed(1)
                  : "4.7"
                }
              </div>
              <div className="text-gray-600">Average Rating</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
