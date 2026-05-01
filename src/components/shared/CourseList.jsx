"use client"

import CourseCard from "@/components/shared/CourseCard"
import CourseBlockSkeleton from "./courseBlockSkeleton"
import DataPagination from "./DataPagination"

function CourseList({
    courses = [],
    isLoading = false,
    currentPage = 1,
    totalItems = 0,
    pageSize = 9,
    showPagination = true,
    className = "",
    onPageChange,
}) {
    return (
        <div className={className}>
            {
                isLoading ?
                    <CourseBlockSkeleton /> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses?.map((course) => (
                            <CourseCard key={course?.id} course={course} />
                        ))}
                    </div>
            }


            {showPagination && totalItems > pageSize && (
                <div className="mt-8">
                    <DataPagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    )
}

export default CourseList