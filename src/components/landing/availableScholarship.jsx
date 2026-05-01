"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Target, Star, ArrowRight, Code, Clock, User } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import axios from "@/lib/axios"

const AvailableScholarship = () => {
  const router = useRouter()
  const [scholarships, setScholarships] = useState([])
  const [loadingScholarships, setLoadingScholarships] = useState(false)

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoadingScholarships(true)
      try {
        // primary endpoint is /scholarship as used elsewhere; fall back to /scholarships
        let res
        try {
          res = await axios.get('/scholarships')
        } catch (e) {
          res = await axios.get('/scholarships')
        }
        setScholarships(res.data?.data || [])
      } catch (err) {
        setScholarships([])
      } finally {
        setLoadingScholarships(false)
      }
    }
    fetchScholarships()
  }, [])

  return (
    
       <div className="py-16 px-4 bg-muted/30">
              <div className="container mx-auto">
                <div className="text-start mb-12">
                  <h2 className="text-3xl font-bold font-heading mb-4">Available Scholarships</h2>
                  <p className="text-muted-foreground">Apply now - Limited time offers</p>
                </div>
      
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Render nothing (blank) when there are no scholarships per request */}
                  {Array.isArray(scholarships) && scholarships.length > 0 && (
                    scholarships.map((s, idx) => {
                      const isFirst = idx === 0
                      return (
                        <Card
                          key={s.id}
                          className={`hover:shadow-lg transition-shadow rounded-lg ${isFirst ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={`${isFirst ? 'bg-emerald-100 text-emerald-800' : (s.for_tuition_fee_or_cash_scholarship ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800')} text-xs`}>
                                  {s.for_tuition_fee_or_cash_scholarship ? (isFirst ? 'Instant Award' : 'Cash / Tuition') : 'Scholarship'}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${isFirst ? 'text-emerald-600' : 'text-slate-900'}`}>{s.amount ? `$${s.amount}` : ''}</div>
                                <div className="text-xs text-muted-foreground">{s.application_deadline ? '' : 'No application required'}</div>
                              </div>
                            </div>
                            <CardTitle className="text-lg font-bold mt-3">{s.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* short description */}
                            <div className="mb-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.short_description || '' }} />

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{s.application_start_date && s.application_deadline ? (
                                  (new Date(s.application_start_date) <= new Date() && new Date(s.application_deadline) >= new Date()) ? 'Available now' : `Apply by ${s.application_deadline ? new Date(s.application_deadline).toLocaleDateString() : ''}`
                                ) : (s.application_deadline ? `Apply by ${new Date(s.application_deadline).toLocaleDateString()}` : '')}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span>{s.eligibility_criteria ? 'See eligibility' : ''}</span>
                              </div>
                            </div>

                            <div>
                              <button
                                onClick={() => router.push(`/learninghub/scholarship-details/${s.id}`)}
                                className={`w-full rounded-md px-4 py-3 text-sm ${isFirst ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-900'}`}
                              >
                                Apply Now
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
  )
}

export default AvailableScholarship;
