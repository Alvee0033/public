"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Map, List, Building2, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const schoolDistricts = [
  "New York City Department of Education, New York",
  "Los Angeles Unified School District, California",
  "Chicago Public Schools, Illinois",
  "Miami-Dade County Public Schools, Florida",
  "Clark County School District, Nevada",
  "Broward County Public Schools, Florida",
  "Houston Independent School District, Texas",
  "Hillsborough County Public Schools, Florida",
  "Orange County Public Schools, Florida",
  "Palm Beach County School District, Florida",
  "Fairfax County Public Schools, Virginia",
  "Gwinnett County Public Schools, Georgia",
  "Montgomery County Public Schools, Maryland",
  "Dallas Independent School District, Texas",
  "Wake County Public School System, North Carolina",
  "Philadelphia City School District, Pennsylvania",
  "Charlotte-Mecklenburg Schools, North Carolina",
  "San Diego Unified School District, California",
  "Duval County Public Schools, Florida",
  "Cobb County School District, Georgia",
  "Polk County School District, Florida",
  "Fulton County Schools, Georgia",
  "Pinellas County Schools, Florida",
  "Baltimore County Public Schools, Maryland",
  "Prince George's County Public Schools, Maryland",
  "DeKalb County School District, Georgia",
  "Denver Public Schools, Colorado",
  "Jefferson County Public Schools, Kentucky",
  "Orange County School District, California",
  "School District of Philadelphia, Pennsylvania",
  "Boston Public Schools, Massachusetts",
  "Austin Independent School District, Texas",
  "Fort Worth Independent School District, Texas",
  "Northside Independent School District, Texas",
  "Detroit Public Schools Community District, Michigan",
  "Long Beach Unified School District, California",
  "Fresno Unified School District, California",
  "Albuquerque Public Schools, New Mexico",
  "Mesa Public Schools, Arizona",
  "Virginia Beach City Public Schools, Virginia",
  "Pasco County Schools, Florida",
  "Prince William County Public Schools, Virginia",
  "Anne Arundel County Public Schools, Maryland",
  "El Paso Independent School District, Texas",
  "Volusia County Schools, Florida",
  "Jefferson County School District, Colorado",
  "Clayton County Public Schools, Georgia",
  "St. Louis Public Schools, Missouri",
  "Seattle Public Schools, Washington",
  "Fort Bend Independent School District, Texas",
]

const cities = [
  "New York, New York",
  "Los Angeles, California",
  "Chicago, Illinois",
  "Houston, Texas",
  "Phoenix, Arizona",
  "Philadelphia, Pennsylvania",
  "San Antonio, Texas",
  "San Diego, California",
  "Dallas, Texas",
  "San Jose, California",
  "Austin, Texas",
  "Jacksonville, Florida",
  "Fort Worth, Texas",
  "Columbus, Ohio",
  "Charlotte, North Carolina",
  "San Francisco, California",
  "Indianapolis, Indiana",
  "Seattle, Washington",
  "Denver, Colorado",
  "Washington, D.C.",
  "Boston, Massachusetts",
  "El Paso, Texas",
  "Nashville, Tennessee",
  "Detroit, Michigan",
  "Oklahoma City, Oklahoma",
  "Portland, Oregon",
  "Las Vegas, Nevada",
  "Memphis, Tennessee",
  "Louisville, Kentucky",
  "Baltimore, Maryland",
  "Milwaukee, Wisconsin",
  "Albuquerque, New Mexico",
  "Tucson, Arizona",
  "Fresno, California",
  "Mesa, Arizona",
  "Sacramento, California",
  "Atlanta, Georgia",
  "Kansas City, Missouri",
  "Colorado Springs, Colorado",
  "Miami, Florida",
  "Raleigh, North Carolina",
  "Omaha, Nebraska",
  "Long Beach, California",
  "Virginia Beach, Virginia",
  "Oakland, California",
  "Minneapolis, Minnesota",
  "Tulsa, Oklahoma",
  "Arlington, Texas",
  "Tampa, Florida",
  "New Orleans, Louisiana",
]

export default function LearningHubDirectory({ trigger, showMobileIcon = false }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("list")
  const [selectedTab, setSelectedTab] = useState("districts")

  const filteredDistricts = schoolDistricts.filter((district) =>
    district.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCities = cities.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()))

  const defaultTrigger = showMobileIcon ? (
    <Button variant="ghost" size="sm" className="md:hidden p-2">
      <MapPin className="h-5 w-5 text-primary" />
    </Button>
  ) : (
    // Note: header already renders a MapPin icon to the left — avoid duplicating it here
    <div className="flex items-center space-x-2 text-sm font-medium text-[#008fb0] hover:text-primary/80 transition-colors cursor-pointer px-1 py-2 rounded-lg hover:bg-primary/5">
      <span className="hidden md:inline font-semibold">LearningHub</span>
    </div>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden p-0">
        {/* Top gradient banner to match colorful UI */}
        <div className="w-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 p-6 rounded-t-xl">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-center">
              <span className="text-white">
                LearningHub Directory
              </span>
              <div className="text-sm font-normal text-white/80 mt-1">
                1,100+ School Districts & Learning Centers Nationwide
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by city, school district, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-white border border-slate-200 focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="min-w-[80px] bg-cyan-500"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="min-w-[80px]"
              >
                <Map className="h-4 w-4 mr-2 " />
                Map
              </Button>
            </div>
          </div>

          {viewMode === "map" ? (
            <div className="h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Map className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Interactive Map View</h3>
                <p className="text-muted-foreground">Coming soon - Explore learning hubs on an interactive map</p>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-cyan-500" />
                    <h3 className="font-bold text-lg">School Districts</h3>
                  </div>
                  <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-500">
                    {filteredDistricts.length} districts
                  </Badge>
                </div>
                <div className="bg-white rounded-lg p-4 max-h-80 overflow-y-auto shadow-sm border border-primary/5">
                  <div className="space-y-2">
                    {filteredDistricts.map((district, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm border border-transparent hover:border-cyan-500 group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 group-hover:bg-cyan-500 transition-colors" />
                          <span className="text-sm leading-relaxed group-hover:text-cyan-500 transition-colors">
                            {district}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-400" />
                    <h3 className="font-bold text-lg">Major Cities</h3>
                  </div>
                  <Badge variant="secondary" className="bg-purple-400/10 text-purple-400">
                    {filteredCities.length} cities
                  </Badge>
                </div>
                <div className="bg-white rounded-lg p-4 max-h-80 overflow-y-auto shadow-sm border border-secondary/5">
                  <div className="space-y-2">
                    {filteredCities.map((city, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm border border-transparent hover:border-purple-400 group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-300 mt-2 group-hover:bg-purple-400 transition-colors" />
                          <span className="text-sm leading-relaxed group-hover:text-purple-400 transition-colors">
                            {city}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-6 border-t">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500 text-white px-6 py-3 rounded-full shadow-md inline-flex items-center font-semibold"
            >
              <MapPin className="h-4 w-4 mr-3 text-white" />
              Find Learning Hubs Near Me
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
