import CourseCard from "@/app/learninghub/course-list/CourseCard";
import { instance } from "@/lib/axios";
import useSWR from "swr";
import CourseBlockSkeleton from "../shared/courseBlockSkeleton";
import SectionTitle from "../shared/section-title";


export default function TrendingCourseSection() {
    const getCourses = async () => {
        const res = await instance.get(`/courses?limit=3&filter=${JSON.stringify({
            is_trending_course: true,
        })}`);
        return res?.data?.data;
    };
    const {
        data: courses,
        isLoading,
        error,
    } = useSWR("trending-courses", getCourses);
    return (
        <div className="bg-gradient-to-br container p-4 rounded-lg mt-10">
            <SectionTitle
                title="Trending Courses"
                path="/learninghub/trending-course"
            />
            {isLoading ? (
                <CourseBlockSkeleton count={3} />
            ) : <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses?.map((plan, i) => <CourseCard key={plan.id} course={plan} />)}
            </div>
            }
        </div >
    )
}
