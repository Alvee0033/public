"use client"
import CourseList from "@/components/shared/CourseList"
import PageTitle from "@/components/shared/pageTitle"
import axios from "axios"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import useSWR from "swr"

export default function CategoryPage({ params }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const getCourses = async () => {
        const skip = (currentPage - 1) * pageSize;
        const queryString = new URLSearchParams({
            pagination: true,
            limit: pageSize,
            skip,
        }).toString();
        const res = await axios.get(
            `/courses?${queryString}&filter=${JSON.stringify({
                course_category: params.id,
            })}`
        );
        return res?.data;

    };

    const { data: courses, isLoading, error } = useSWR([params?.id, currentPage], getCourses)

    const category = useSearchParams().get("category")
    const totalItems = courses?.pagination?.total || 0;

    return (
        <>
            <PageTitle path={category} title={category} />
            <div className="container mx-auto">
                <Link href="/learninghub/course-categories" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Categories
                </Link>
            </div>
            <div className="container mx-auto px-4 py-12">
                {!isLoading && courses?.data?.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                        <p className="mt-2 text-sm text-gray-500">There are no courses available in this category yet.</p>
                    </div>
                ) : (
                    <CourseList
                        courses={courses?.data}
                        isLoading={isLoading}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </>
    )
}