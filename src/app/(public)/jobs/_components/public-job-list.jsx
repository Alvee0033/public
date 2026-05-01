"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from 'swr'
import { JobCard } from "./job-card"
import axios from "@/lib/axios"

export default function PublicJobList() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedJobTypes, setSelectedJobTypes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedJobType, setSelectedJobType] = useState("all")
  const [selectedPosted, setSelectedPosted] = useState("anytime")
  const [selectedExperience, setSelectedExperience] = useState([])
  const [zipCode, setZipCode] = useState("")
  const [selectedDistance, setSelectedDistance] = useState([])
  
  const fetcher = (url) => axios.get(url).then(res => res.data?.data)
    // SWR hook for fetching jobs
  const { data: jobs, error, isLoading, mutate } = useSWR(
    `/jobs`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  // Helper function to filter jobs based on current selections
  const getFilteredJobs = () => {
    if (!jobs) return []
    
    return jobs.filter(job => {
      // Search keyword filter
      if (searchKeyword && !job.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !job.company?.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false
      }
      
      // Location filter
      if (searchLocation && !job.job_location_address?.toLowerCase().includes(searchLocation.toLowerCase()) &&
          !job.city?.toLowerCase().includes(searchLocation.toLowerCase()) &&
          !job.country?.name.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false
      }
      
      // Job type filters (Full time, Gig work, Remote)
      if (selectedJobTypes.includes('fulltime') && !job.full_time_job_or_gig_work) return false
      if (selectedJobTypes.includes('localgig') && job.full_time_job_or_gig_work) return false
      if (selectedJobTypes.includes('remote') && !job.remote_or_onsite_work) return false
      
      // Category filter
      if (selectedCategory !== 'all' && job.job_category?.name !== selectedCategory) return false
      
      // Salary/Fixed price filter
      if (selectedJobType === 'salary' && !job.salary_or_fixed_price) return false
      if (selectedJobType === 'fixed' && job.salary_or_fixed_price) return false
      
      // Posted date filter
      if (selectedPosted !== 'anytime') {
        const jobDate = new Date(job.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24))
        
        if (selectedPosted === 'today' && daysDiff > 0) return false
        if (selectedPosted === 'week' && daysDiff > 7) return false
        if (selectedPosted === 'month' && daysDiff > 30) return false
      }
      
      // Experience filter
      if (selectedExperience.length > 0) {
        const minExp = job.minimum_experience || 0
        const maxExp = job.maximum_experience || 0
        const hasMatchingExp = selectedExperience.some(expLevel => {
          if (expLevel === 'entry' && maxExp <= 2) return true
          if (expLevel === 'mid' && minExp >= 2 && maxExp <= 5) return true
          if (expLevel === 'senior' && minExp >= 5) return true
          return false
        })
        if (!hasMatchingExp) return false
      }
      
      return true
    })
  }

  const filteredJobs = getFilteredJobs()

  // Helper functions to get dynamic counts
  const getJobTypeCount = (type) => {
    if (!jobs) return 0
    if (type === 'fulltime') return jobs.filter(job => job.full_time_job_or_gig_work === true).length
    if (type === 'localgig') return jobs.filter(job => job.full_time_job_or_gig_work === false).length
    if (type === 'remote') return jobs.filter(job => job.remote_or_onsite_work === true).length
    return 0
  }

  const getExperienceCount = (level) => {
    if (!jobs) return 0
    return jobs.filter(job => {
      const minExp = job.minimum_experience || 0
      const maxExp = job.maximum_experience || 0
      if (level === 'entry') return maxExp <= 2
      if (level === 'mid') return minExp >= 2 && maxExp <= 5
      if (level === 'senior') return minExp >= 5
      return false
    }).length
  }

  const getUniqueCategories = () => {
    if (!jobs) return []
    const categories = jobs
      .map(job => job.job_category?.name)
      .filter(Boolean)
      .filter((name, index, arr) => arr.indexOf(name) === index)
    return categories
  }

  // Handle checkbox changes
  const handleJobTypeChange = (type, checked) => {
    if (checked) {
      setSelectedJobTypes(prev => [...prev, type])
    } else {
      setSelectedJobTypes(prev => prev.filter(t => t !== type))
    }
  }

  const handleExperienceChange = (level, checked) => {
    if (checked) {
      setSelectedExperience(prev => [...prev, level])
    } else {
      setSelectedExperience(prev => prev.filter(l => l !== level))
    }
  }

  const handleDistanceChange = (distance, checked) => {
    if (checked) {
      setSelectedDistance(prev => [...prev, distance])
    } else {
      setSelectedDistance(prev => prev.filter(d => d !== distance))
    }
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-3 flex flex-col md:flex-row gap-4">
        {/* Left Sidebar - Search Filters */}
        <div className="w-full md:w-[240px] md:h-[600px] bg-gray-50 p-3 rounded border">
          <div className="space-y-3">
            <Input
              placeholder="Search jobs..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="h-8 text-sm border-gray-300 focus-visible:!border-violet-500 focus-visible:!ring-violet-500 focus-visible:!ring-0.5 focus:!outline-none"
            />

            <Input
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="h-8 text-sm border-gray-300 focus-visible:!border-violet-500 focus-visible:!ring-violet-500 focus-visible:!ring-0.5 focus:!outline-none"
            />

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fulltime" 
                  checked={selectedJobTypes.includes('fulltime')}
                  onCheckedChange={(checked) => handleJobTypeChange('fulltime', checked)}
                  className="h-4 w-4 border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 data-[state=checked]:text-white" 
                />
                <label htmlFor="fulltime" className="text-xs">
                  Full time ({getJobTypeCount('fulltime')})
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="localgig" 
                  checked={selectedJobTypes.includes('localgig')}
                  onCheckedChange={(checked) => handleJobTypeChange('localgig', checked)}
                  className="h-4 w-4 border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 data-[state=checked]:text-white" 
                />
                <label htmlFor="localgig" className="text-xs">
                  Gig Work ({getJobTypeCount('localgig')})
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remote" 
                  checked={selectedJobTypes.includes('remote')}
                  onCheckedChange={(checked) => handleJobTypeChange('remote', checked)}
                  className="h-4 w-4 border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 data-[state=checked]:text-white" 
                />
                <label htmlFor="remote" className="text-xs">
                  Remote Jobs ({getJobTypeCount('remote')})
                </label>
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hover:bg-violet-400 focus:bg-violet-500 data-[highlighted]:bg-violet-500">All Categories</SelectItem>
                {getUniqueCategories().map(category => (
                  <SelectItem key={category} value={category} className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">All Types</SelectItem>
                <SelectItem value="salary" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">Salary Based</SelectItem>
                <SelectItem value="fixed" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">Fixed Price</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPosted} onValueChange={setSelectedPosted}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anytime" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">Anytime</SelectItem>
                <SelectItem value="today" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">Today</SelectItem>
                <SelectItem value="week" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">This Week</SelectItem>
                <SelectItem value="month" className="hover:bg-violet-500 focus:bg-violet-500 data-[highlighted]:bg-violet-500">This Month</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  // Force re-render by triggering SWR revalidation
                  mutate()
                }}
                className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-sm text-white"
              >
                Search
              </Button>
              <Button 
                onClick={() => {
                  setSearchKeyword("")
                  setSearchLocation("")
                  setSelectedJobTypes([])
                  setSelectedCategory("all")
                  setSelectedJobType("all")
                  setSelectedPosted("anytime")
                  setSelectedExperience([])
                  setZipCode("")
                  setSelectedDistance([])
                }}
                variant="outline"
                className="h-8 text-sm px-3 hover:bg-violet-500"
              >
                Clear
              </Button>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-1">Experience</h3>
              <div className="space-y-1">
                {[
                  { key: 'entry', label: `Entry Level (${getExperienceCount('entry')})` },
                  { key: 'mid', label: `Mid Level (${getExperienceCount('mid')})` },
                  { key: 'senior', label: `Senior Level (${getExperienceCount('senior')})` }
                ].map((level, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`exp-${i}`} 
                      checked={selectedExperience.includes(level.key)}
                      onCheckedChange={(checked) => handleExperienceChange(level.key, checked)}
                      className="h-4 w-4 border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 data-[state=checked]:text-white" 
                    />
                    <label htmlFor={`exp-${i}`} className="text-xs">
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-1">Distance</h3>
              <Input 
                placeholder="Zip Code" 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="h-8 text-sm border-gray-300 focus-visible:!border-violet-500 focus-visible:!ring-violet-500 focus-visible:!ring-0.5 focus:!outline-none"
              />
              <div className="space-y-1 mt-2">
                {[
                  { key: '5', label: `5 miles (${jobs ? jobs.length : 0})` },
                  { key: '25', label: `25 miles (${jobs ? jobs.length : 0})` },
                  { key: '50', label: `50 miles (${jobs ? jobs.length : 0})` }
                ].map((distance, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`dist-${i}`} 
                      checked={selectedDistance.includes(distance.key)}
                      onCheckedChange={(checked) => handleDistanceChange(distance.key, checked)}
                      className="h-4 w-4 border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 data-[state=checked]:text-white" 
                    />
                    <label htmlFor={`dist-${i}`} className="text-xs">
                      {distance.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 w-full">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="w-24 h-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-500 mb-4">We couldn't load the job listings right now. Please check your connection and try again.</p>
                <Button 
                  onClick={() => mutate()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">💼</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Posts Available</h3>
                <p className="text-gray-500 mb-4">
                  We don't have any job listings at the moment. New opportunities are posted regularly, so please check back soon!
                </p>
                <p className="text-sm text-gray-400">
                  Want to be the first to know? Subscribe to our notifications for new job alerts.
                </p>
              </div>
            </div>
          ) : filteredJobs?.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Match Your Filters</h3>
                <Button 
                  onClick={() => {
                    setSearchKeyword("")
                    setSearchLocation("")
                    setSelectedJobTypes([])
                    setSelectedCategory("all")
                    setSelectedJobType("all")
                    setSelectedPosted("anytime")
                    setSelectedExperience([])
                    setZipCode("")
                    setSelectedDistance([])
                  }}
                  variant="outline" 
                  className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            filteredJobs?.map((job, index) => (
              <JobCard key={index} job={job} />
            ))
          )}
        </div>
      </div>
      
    </div>
  )
}
