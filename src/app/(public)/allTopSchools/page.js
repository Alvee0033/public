"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin, School, Star } from "lucide-react"
// import { brooklynSchools, containerVariants, itemVariants } from "@/components/landing/course_data"
import { useEffect, useState } from "react"

function AllTopSchools() {
  const [currentPage, setCurrentPage] = useState(1)
  const [displayedSchools, setDisplayedSchools] = useState([])
  const schoolsPerPage = 6

  // Commented out dummy data integration
  // const totalPages = Math.ceil(brooklynSchools.length / schoolsPerPage)
  const totalPages = 0 // No data available

  useEffect(() => {
    // Commented out dummy data integration
    // const indexOfLastSchool = currentPage * schoolsPerPage
    // const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage
    // const currentSchools = brooklynSchools.slice(indexOfFirstSchool, indexOfLastSchool)
    // setDisplayedSchools(currentSchools)
    setDisplayedSchools([]) // Empty array since no data available
  }, [currentPage])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Schools Header Section */}
      <section className="mb-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 text-sm font-medium">
              Top Schools
            </Badge>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              Brooklyn, NY
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Top Schools in Brooklyn
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most prestigious educational institutions in Brooklyn
          </p>
        </motion.div>

        {displayedSchools.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            // variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayedSchools.map((school) => (
              <motion.div key={school.id} /* variants={itemVariants} */>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full border border-blue-100">
                  <div className={`p-6 bg-gradient-to-r ${school.gradientFrom} flex items-center gap-4`}>
                    <div className="bg-white p-3 rounded-xl">{school.icon}</div>
                    <div>
                      <Badge className="bg-white/20 text-white mb-1">{school.rank}</Badge>
                      <h3 className="text-xl font-bold text-white">{school.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium ml-1">
                          {school.rating} ({school.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{school.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{school.description}</p>
                    <div className="space-y-3 mb-6">
                      {school.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {feature.icon}
                          <span className="text-sm text-gray-600">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                    <Button className={`w-full ${school.buttonColor} text-white`}>
                      View School Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No schools found</h3>
            <p className="text-gray-500">We couldn&apos;t find any schools to display.</p>
          </div>
        )}

        {/* Pagination Controls - Hidden when no data */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                onClick={() => handlePageChange(index + 1)}
                className={`h-10 w-10 ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "hover:bg-blue-50"
                }`}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

export default AllTopSchools