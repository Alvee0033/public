import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { motion } from "framer-motion"
import {
    Star,
    CheckCircle,
    Users,
    Zap,
    Award,
    ArrowRight,
    BookOpen,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"

// Prime Bundle features
const bundleFeatures = [
    { icon: <CheckCircle className="h-5 w-5 text-purple-600" />, text: "All Subjects of any 3rd-12th Grade" },
    { icon: <Users className="h-5 w-5 text-purple-600" />, text: "Unlimited 1:1 or group tutoring" },
    { icon: <Zap className="h-5 w-5 text-purple-600" />, text: "Unlimited self-learning" },
    { icon: <Award className="h-5 w-5 text-purple-600" />, text: "ScholarsPASS scholarship $1,000" },
]

export default function PrimeCourse() {
    const { data, isLoading, error } = useSWR(['prime-course'], async () => {
        const res = await axios.get('/courses?limit=3');
        return res?.data?.data || [];
    })

    const course = data?.find(course => course.id === 1);

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Featured Package Badge */}
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                            <Badge className="bg-purple-100 text-purple-700 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold">
                                Featured Package
                            </Badge>
                        </div>

                        {/* Most Popular Choice Badge */}
                        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10">
                            <Badge className="bg-purple-600 text-white px-3 sm:px-6 py-1.5 sm:py-3 text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                                Most Popular Choice
                            </Badge>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Left Content */}
                            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 mt-4 sm:mt-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {course?.name || "ScholarPASS K12 Bundle"}
                                </h2>

                                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                    One comprehensive course covering all subjects for any K-12
                                    grade, designed to provide complete educational support.
                                </p>

                                {/* Features Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    {bundleFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm sm:text-base text-gray-800">{feature.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Section */}
                                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                        <div className="bg-white/50 p-3 rounded-lg">
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1">REGULAR PRICE</p>
                                            {isLoading ? (
                                                <div className="h-6 sm:h-8 w-20 sm:w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                                            ) : (
                                                <p className="text-xl sm:text-2xl font-bold text-gray-800">${course?.regular_price ?? 2400}</p>
                                            )}
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-lg">
                                            <p className="text-xs sm:text-sm text-purple-600 mb-1">SCHOLARPASS</p>
                                            {isLoading ? (
                                                <div className="h-6 sm:h-8 w-20 sm:w-24 bg-purple-200 rounded animate-pulse mx-auto"></div>
                                            ) : (
                                                <p className="text-xl sm:text-2xl font-bold text-purple-600">${course?.discounted_amount ?? 1800}</p>
                                            )}
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-lg">
                                            <p className="text-xs sm:text-sm text-green-600 mb-1">STUDENT PAYS</p>
                                            {isLoading ? (
                                                <div className="h-6 sm:h-8 w-20 sm:w-24 bg-green-200 rounded animate-pulse mx-auto"></div>
                                            ) : (
                                                <p className="text-xl sm:text-2xl font-bold text-green-600">
                                                    ${course?.regular_price ? (course?.regular_price - course?.discounted_amount) : 600}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link href={`/learninghub/course-details/1`} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Enroll Now
                                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Right Image */}
                            <div className="relative h-[300px] sm:h-[400px] lg:min-h-[600px] bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10"></div>
                                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                                    <Image
                                        src="/images/tutorsplan-online-tutoring.png"
                                        alt="Student learning online with laptop"
                                        width={500}
                                        height={400}
                                        className="max-w-full max-h-full object-contain rounded-xl sm:rounded-2xl shadow-lg"
                                        priority
                                    />
                                </div>

                                {/* Floating Elements - Hide on smallest screens, show on sm and up */}
                                <div className="hidden sm:block absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            Live Session
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden sm:block absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <BookOpen className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                K-12 Subjects
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                All grades covered
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
