"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, User, Mail, Phone, MapPin, ArrowLeft, Building2, Loader2, Briefcase, Clock } from "lucide-react"
import useSWR from "swr"
import axios from "@/lib/axios"

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string(),
  location: Yup.string(),
  resume: Yup.mixed().nullable(),
  coverLetter: Yup.string(),
  experience: Yup.string(),
  availability: Yup.string(),
  salary: Yup.string(),
  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
})
export default function JobApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = Number.parseInt(params.jobId)
  const fetcher = (url) => axios.get(url).then((res) => res.data.data);
  const { data, isLoading, error } = useSWR(jobId ? `/jobs/${jobId}` : null, fetcher);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    resume: null,
    coverLetter: "",
    experience: "",
    availability: "",
    salary: "",
    agreeToTerms: false,
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true)
    try {
      const playload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        "job_title": "",
        "company_name": "",
        "full_address": "",
        "address": "",
        "zip_code": "",
        "city": "",
        "date_of_birth": "2025-09-18T15:12:48.471Z",
        "tax_or_ssn": "",
        "mobile": "",
        "sms_subscribed": true,
        "whatsapp_number": true,
        "personal_email": "",
        "personal_email_verified": true,
        "personal_email_subscribed": true,
        "business_email": "",
        "business_email_verified": true,
        "business_email_subscribed": true,
        "years_of_experience": "",
        "summary": "",
        "public_profile": "",
        "internal_profile_and_tags": "",
        "facebook": "",
        "linkedin": "",
        "twitter_x": "",
        "profile_picture": "",
        "public_profile_url": "",
        "verified": true,
        "internal_notes": "",
        "archive": true,
        "active_or_passive": true,
        "referred_by_email": "",
        "company": null,
        "state": null,
        "country": null,
        "verified_by_user": null,
        "master_contact_type": null
      }
      const res = await axios.post('/contacts', playload)
      if (res) {
        const contactId = res.data.data.id;
        const response = await axios.post("/job-applicant-hiring-boards",
          {
            "ai_matched_score": 0,
            "hiring_manager_assessment_score": 0,
            "thumbs_up_or_down_by_hiring_manager": true,
            "hiring_manager_remarks": "string",
            "contact": contactId,
            "tutor": null,
            "job": jobId,
            "master_job_applicant_hire_status": null,
            "user": null,
            "employee": null
          }
        )
        toast.success("Application submitted successfully!")
      }
    } catch (error) {
      console.error("Application submission failed:", error)
    } finally {
      setIsSubmitting(false)
      setSubmitting(false)
    }
  }
  if (isLoading) {
    return <div className="container mx-auto px-4 mt-20 max-w-4xl">
      <Loader2 className="animate-spin mx-auto text-violet-500" />
      <p className="text-center text-muted-foreground">Loading...</p>
    </div>
  }
  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-start justify-center pt-20">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="text-center p-8 shadow-lg">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-red-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Job Application Not Available</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.reload()}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/jobs")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Job Board
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => router.push("/jobs")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse All Open Positions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
        <div className="w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20">
        <div className="w-96 h-96 bg-gradient-to-tr from-indigo-400 to-cyan-400 rounded-full" />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center ring-2 ring-white/30">
                    {data?.logo_or_icon ? (
                      <img
                        src={data?.logo_or_icon || "/placeholder.svg"}
                        alt={`${data?.company?.name} logo`}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{data?.title}</CardTitle>
                    <p className="text-sm text-white/80">{data?.company?.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm">
                    {data?.city || data?.company?.city}
                    {data?.state?.name ? (
                      <span className="text-muted-foreground">{`${data?.city || data?.company?.city ? ", " : ""}${data?.state?.name}`}</span>
                    ) : null}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salary</p>
                  <p className="text-sm">{data?.salary_info || "Negotiable"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="text-sm">
                    {data?.minimum_experience}-{data?.maximum_experience} years
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{data?.full_time_job_or_gig_work ? "Full Time" : "Part Time"}</Badge>
                    <Badge variant="secondary">{data?.remote_or_onsite_work ? "Remote" : "On-site"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  Apply for this Position
                </CardTitle>
                <p className="text-white/80">Fill out the form below to submit your application</p>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, values, errors, touched, isSubmitting: formikSubmitting }) => (
                    <Form className="space-y-8">
                      {/* Personal Information */}
                      <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mt-2">
                        <div className="flex items-center space-x-3 pb-4 border-b border-blue-200">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                            <Field
                              as={Input}
                              id="first_name"
                              name="first_name"
                              required
                              className="bg-white/70 border-blue-200 focus:border-blue-400 focus:ring-blue-400 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
                            />
                            <ErrorMessage name="first_name" component="div" className="text-red-500 text-xs" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
                            <Field
                              as={Input}
                              id="last_name"
                              name="last_name"
                              required
                              className="bg-white/70 border-blue-200 focus:border-blue-400 focus:ring-blue-400 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
                            />
                            <ErrorMessage name="last_name" component="div" className="text-red-500 text-xs" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>Email <span className="text-red-500">*</span></span>
                            </Label>
                            <Field
                              as={Input}
                              id="email"
                              name="email"
                              type="email"
                              required
                              className="bg-white/70 border-blue-200 focus:border-blue-400 focus:ring-blue-400 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>Phone</span>
                            </Label>
                            <Field
                              as={Input}
                              id="phone"
                              name="phone"
                              type="tel"
                              className="bg-white/70 border-blue-200 focus:border-blue-400 focus:ring-blue-400 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
                            />
                            <ErrorMessage name="phone" component="div" className="text-red-500 text-xs" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center space-x-2 ">
                            <MapPin className="h-4 w-4" />
                            <span>Current Location</span>
                          </Label>
                          <Field
                            as={Input}
                            id="location"
                            name="location"
                            placeholder="City, State"
                          />
                          <ErrorMessage name="location" component="div" className="text-red-500 text-xs" />
                        </div>
                      </div>

                      {/* Resume Upload */}
                      <div className="space-y-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center space-x-3 pb-4 border-b border-green-200">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-green-900">Resume & Documents</h3>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="resume">Resume <span className="text-red-500">*</span></Label>
                          <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-white/50 hover:bg-white/70 transition-all duration-300 hover:border-green-400 group cursor-pointer"
                               onClick={() => document.getElementById("resume")?.click()}>
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Upload className="h-8 w-8 text-white" />
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <p className="text-lg font-medium text-green-900">
                                  {values.resume ? values.resume.name : "Upload your resume"}
                                </p>
                                <p className="text-sm text-green-600">
                                  Drag and drop or click to browse (PDF, DOC, DOCX)
                                </p>
                              </div>
                              <Input
                                id="resume"
                                name="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={(event) => {
                                  setFieldValue("resume", event.currentTarget.files[0])
                                }}
                              />
                              <Button
                                type="button"
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  document.getElementById("resume")?.click()
                                }}
                              >
                                {values.resume ? "Change File" : "Choose File"}
                              </Button>
                              <ErrorMessage name="resume" component="div" className="text-red-500 text-xs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <div className="flex items-center space-x-3 pb-4 border-b border-purple-200">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <Label htmlFor="coverLetter" className="text-lg font-semibold text-purple-900">Cover Letter</Label>
                        </div>
                        <Field
                          as={Textarea}
                          id="coverLetter"
                          name="coverLetter"
                          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                          rows={6}
                          className="bg-white/70 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent focus:shadow-none"
                          style={{ 
                            boxShadow: 'none',
                            border: '1px solid rgb(196 181 253)', // purple-200 equivalent
                          }}
                          onFocus={(e) => {
                            e.target.style.border = '1px solid rgb(196 181 253)';
                            e.target.style.boxShadow = 'none';
                            e.target.style.outline = 'none';
                          }}
                        />
                        <ErrorMessage name="coverLetter" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Experience & Availability */}
                      <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                        <div className="flex items-center space-x-3 pb-4 border-b border-orange-200 mb-4">
                          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-orange-900">Professional Details</h3>
                        </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Field name="experience">
                            {({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange({ target: { name: "experience", value } })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0-1">0-1 years</SelectItem>
                                  <SelectItem value="2-3">2-3 years</SelectItem>
                                  <SelectItem value="4-5">4-5 years</SelectItem>
                                  <SelectItem value="6-10">6-10 years</SelectItem>
                                  <SelectItem value="10+">10+ years</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage name="experience" component="div" className="text-red-500 text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="availability">Availability</Label>
                          <Field name="availability">
                            {({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange({ target: { name: "availability", value } })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="When can you start?" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="immediately">Immediately</SelectItem>
                                  <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                                  <SelectItem value="1-month">1 month</SelectItem>
                                  <SelectItem value="2-months">2 months</SelectItem>
                                  <SelectItem value="3-months">3+ months</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage name="availability" component="div" className="text-red-500 text-xs" />
                        </div>
                      </div>
                      </div>
                      {/* Salary Expectations */}
                      <div className="space-y-4 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                        <div className="flex items-center space-x-3 pb-4 border-b border-teal-200">
                          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">$</span>
                          </div>
                          <Label htmlFor="salary" className="text-lg font-semibold text-teal-900">Salary Expectations</Label>
                        </div>
                        <Field
                          as={Input}
                          id="salary"
                          name="salary"
                          placeholder="e.g., $80,000 - $100,000"
                          className="bg-white/70 border-teal-200 focus:border-teal-400 focus:ring-teal-400 rounded-lg shadow-sm"
                        />
                        <ErrorMessage name="salary" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Terms Agreement */}
                      <div className="flex items-center space-x-2">
                        <Field name="agreeToTerms">
                          {({ field }) => (
                            <Checkbox
                              id="terms"
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange({ target: { name: "agreeToTerms", value: checked } })}
                              className="border-violet-400 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-violet-500"
                            />
                          )}
                        </Field>
                        <ErrorMessage name="agreeToTerms" component="div" className="text-red-500 text-xs" />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <a href="#" className="text-violet-600 hover:text-violet-800 hover:underline">
                            terms and conditions
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-violet-600 hover:text-violet-800 hover:underline">
                            privacy policy
                          </a>
                        </Label>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end space-x-4 pt-8 border-t border-indigo-200">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => router.push("/")}
                          className="px-6 py-3 border-indigo-300 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || formikSubmitting} 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {(isSubmitting || formikSubmitting) ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Submitting...</span>
                            </div>
                          ) : "Submit Application"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
