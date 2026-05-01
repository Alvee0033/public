"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "@/lib/axios";
import {
    MapPin,
    Clock,
    DollarSign,
    Briefcase,
    Calendar,
    Building2,
    ExternalLink,
    CheckCircle,
    Users,
    Award,
    Loader2,
} from "lucide-react"
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { formatQuillEditorHtml, smartFormatContent } from "@/lib/parseHtml";

export default function JobDetailsPage() {
    const { id } = useParams();
    const fetcher = (url) => axios.get(url).then((res) => res.data.data);
    const { data, isLoading, error } = useSWR(id ? `/jobs/${id}` : null, fetcher);
    const job = data;
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatMarketCap = (marketCap) => {
        return `$${(marketCap / 1000).toFixed(1)}B`
    }
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="animate-pulse">
                    {/* Header Section Skeleton */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                </div>
                                <div className="flex items-center gap-4 text-sm mb-3">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="ml-6">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 w-32 bg-gray-200 rounded"></div>
                            <div className="h-10 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Content Sections Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-lg border p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg border p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg border p-6">
                                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (!job) {
        return (
            <div className="min-h-screen bg-background flex items-start justify-center pt-40">
                <div className="container mx-auto px-4 max-w-md">
                    <Card className="text-center p-8 shadow-lg">
                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-10 h-10 text-red-400" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-gray-900">Job Not Found</h2>
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
                                    onClick={() => window.history.back()}
                                >
                                    Back to Previous Page
                                </Button>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                                <Link href="/jobs">
                                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                                        <Briefcase className="w-4 h-4 mr-2" />
                                        Browse All Jobs
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header Section */}
            <div className="mb-10">
                <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-xl border shadow-sm p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                {/* Company Logo */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Building2 className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h1 className="text-4xl font-bold text-gray-900 leading-tight">{job?.title}</h1>
                                        <Badge variant="secondary" className={`px-3 py-1 text-sm font-semibold ${
                                            new Date(job?.hire_by_date) >= new Date()
                                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors"
                                                : "bg-red-100 text-red-800 border-red-200"
                                        }`}>
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            {new Date(job?.hire_by_date) >= new Date() ? "Open" : "Closed"}
                                        </Badge>
                                    </div>
                                    <p className="text-xl text-blue-600 font-semibold mb-3">{job?.company?.name}</p>
                                    <div className="flex items-center gap-6 text-gray-600 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium">
                                                {job?.city || job?.company?.city}, {job?.state?.name}, {job?.country?.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-500" />
                                            <span className="font-medium">Posted {formatDate(job?.start_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 flex-wrap">
                        <Link href={`/jobs/apply/${id}`} target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                Apply Now
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="px-6 py-3 border-2 hover:bg-gray-50 transition-all duration-200">
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Save Job
                        </Button>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Location</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-1">{job?.city}</p>
                            <p className="text-sm text-gray-600 mb-1">
                                {job?.state?.name}, {job?.country?.ticker}
                            </p>
                            <p className="text-xs text-gray-500">Remote/On-site Available</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Job Type</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-1">{job?.full_time_job_or_gig_work ? "Full Time" : "Part Time"}</p>
                            <p className="text-sm text-gray-600">{job?.remote_or_onsite_work ? "Remote" : "On-site"}</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 hover:border-l-purple-600">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Salary</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-1">{job?.salary_info ? job?.salary_info : "Negotiable"}</p>
                            <p className="text-sm text-gray-600">Competitive Package</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:border-l-orange-600">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Briefcase className="w-5 h-5 text-orange-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Experience</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-1">
                                {job?.minimum_experience}-{job?.maximum_experience} years
                            </p>
                            <p className="text-sm text-gray-600">Required Experience</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Important Dates */}
            <Card className="mb-8 shadow-md border-0 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        Important Dates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-l-green-500">
                            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Start Date</p>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{formatDate(job?.start_date)}</p>
                            <p className="text-sm text-green-600 font-medium">Position Available</p>
                        </div>
                        <div className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-l-red-500">
                            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Application Deadline</p>
                            <p className="text-2xl font-bold text-red-600 mb-1">{formatDate(job?.hire_by_date)}</p>
                            <p className="text-sm text-red-500 font-medium">
                                {new Date(job?.hire_by_date) >= new Date() ? "Apply Soon!" : "Deadline Passed"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Job Description */}
            <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        Job Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-2 [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: formatQuillEditorHtml(job?.public_job_description) }}
                    />
                </CardContent>
            </Card>

            {/* Company Details */}
            <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                        Company Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Industry</p>
                                <p className="text-lg font-bold text-gray-900">{job?.company?.industry}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Market Cap</p>
                                <p className="text-lg font-bold text-gray-900">{formatMarketCap(job?.company?.market_cap)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Location</p>
                                <p className="text-lg font-bold text-gray-900">{job?.company?.city}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Website</p>
                                <a
                                    href={job?.company?.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2 font-medium transition-colors duration-200"
                                >
                                    Visit Website
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Verification</p>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-lg font-bold text-green-600">Verified</span>
                                </div>
                            </div>
                        </div>
                        
                        {job?.company?.description && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">About the Company</h4>
                                <div
                                    className="prose prose-base max-w-none text-gray-700 [&>ul]:list-none [&>ul]:ml-0 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-2 [&>p]:mb-4 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3"
                                    dangerouslySetInnerHTML={{ 
                                        __html: smartFormatContent(job?.company?.description)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Referral Information */}
            <Card className="mb-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                        <div className="p-2 bg-purple-200 rounded-lg">
                            <Users className="w-6 h-6 text-purple-700" />
                        </div>
                        Referral Program
                        <Badge className="bg-purple-600 text-white px-3 py-1">
                            <Award className="w-4 h-4 mr-1" />
                            Earn Rewards
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Highlight Points */}
                    <div className="text-center mb-8 p-6 bg-white rounded-xl shadow-sm border-2 border-purple-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Award className="w-8 h-8 text-purple-600" />
                            <span className="text-lg font-semibold text-gray-700">Total Referral Points</span>
                        </div>
                        <p className="text-4xl font-bold text-purple-600 mb-2">{job?.referral_points}</p>
                        <p className="text-sm text-gray-600">Points earned for successful referrals</p>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Employer Fee</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">${job?.referral_fee_from_employer}</p>
                            <p className="text-xs text-gray-500 mt-1">Paid by employer</p>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Referrer Fee</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">${job?.referral_fee_for_referrer}</p>
                            <p className="text-xs text-gray-500 mt-1">Your reward</p>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                            <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Applicant Fee</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">${job?.referral_fee_for_applicant}</p>
                            <p className="text-xs text-gray-500 mt-1">Candidate bonus</p>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-5 h-5 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Hub Partner Fee</span>
                            </div>
                            <p className="text-2xl font-bold text-orange-600">${job?.referral_fee_for_hub_partner}</p>
                            <p className="text-xs text-gray-500 mt-1">Partner reward</p>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-teal-500">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-teal-600" />
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Employee Fee</span>
                            </div>
                            <p className="text-2xl font-bold text-teal-600">${job?.referral_fee_for_employee}</p>
                            <p className="text-xs text-gray-500 mt-1">Employee bonus</p>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-indigo-600" />
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Platform Fee</span>
                            </div>
                            <p className="text-2xl font-bold text-indigo-600">${job?.referral_fee_for_platform}</p>
                            <p className="text-xs text-gray-500 mt-1">Platform share</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600 text-center">
                            <strong>💡 Pro Tip:</strong> Refer qualified candidates and earn rewards while helping them find their dream job!
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* About Company */}
            <Card className="mb-10 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                        <div className="p-2 bg-slate-200 rounded-lg">
                            <Building2 className="w-6 h-6 text-slate-700" />
                        </div>
                        About {job?.company?.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                        <p className="text-gray-700 text-lg leading-relaxed">
                            <strong>{job?.company?.name}</strong> ({job?.company?.trade_name}) is a leading company in the <strong>{job?.company?.industry}</strong> industry,
                            headquartered in <strong>{job?.company?.city}</strong>. With a market capitalization of{" "}
                            <strong>{formatMarketCap(job?.company?.market_cap)}</strong>, we are committed to delivering exceptional value to our customers
                            and creating meaningful career opportunities for our employees.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Button variant="outline" size="lg" asChild className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                            <a
                                href={job?.company?.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Visit Company Website
                            </a>
                        </Button>
                        <Button variant="ghost" size="lg" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Users className="w-5 h-5 mr-2" />
                            View More Jobs
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Final Apply Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-10 shadow-xl">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Apply?</h2>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join {job?.company?.name} and be part of an innovative team that's shaping the future of {job?.company?.industry}.
                        Don't miss this opportunity to advance your career!
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link href={`/jobs/apply/${id}`} target="_blank" rel="noopener noreferrer">
                            <Button 
                                size="lg" 
                                className="px-10 py-4 text-lg bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
                            >
                                Apply Now
                                <CheckCircle className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            Refer Someone
                        </Button>
                    </div>
                    <p className="text-blue-200 text-sm mt-6">
                        Application deadline: <strong>{formatDate(job?.hire_by_date)}</strong>
                    </p>
                </div>
            </div>
        </div>
    )
}
