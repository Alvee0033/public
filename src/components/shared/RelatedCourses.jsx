import { Card } from "@/components/ui/card"
import axios from "axios"
import useSWR from "swr"
import CourseCard from "./CourseCard"

export default function RelatedCourses({ currentCourseId, categoryId }) {
    const getRelatedCourses = async () => {
        const res = await axios.get(
            `/courses?category_id=${categoryId}&limit=3&exclude_id=${currentCourseId}`
        )
        return res?.data?.data || []
    }

    const { data: relatedCourses = [], isLoading } = useSWR(
        `related-courses-${categoryId}`,
        getRelatedCourses
    )

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                        <div className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    // Handle navigation to course details page
    const handleExplore = (courseId) => {
        window.location.href = `/learninghub/course-details/${courseId}`;
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Related Courses</h3>
            <div className="grid gap-6">
                {relatedCourses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onExplore={handleExplore}
                    />
                ))}
            </div>
        </div>
    )
}