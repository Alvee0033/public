"use client";
import CategoryBlockSkeleton from "@/components/shared/categoryBlockSkeleton";
import ErrorBlock from "@/components/shared/errorBlock";
import SectionTitle from "@/components/shared/section-title";
import { instance } from "@/lib/axios";
import { isValidUrl } from "@/lib/utils";
import {
  Briefcase,
  ChartBar,
  Code,
  Database,
  Globe,
  Microscope,
  Palette,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const icons = {
  1: <Palette />,
  2: <Microscope />,
  3: <Smartphone />,
  4: <Briefcase />,
  5: <Globe />,
  6: <ChartBar />,
  7: <Code />,
  8: <Database />,
};
export default function CourseCategoryList() {
  const getCategories = async () => {
    const res = await instance.get("/course-categories?limit=8");
    return res?.data?.data;
  };
  const {
    data: categories,
    isLoading,
    error,
  } = useSWR("course-categories", getCategories);

  return (
    <div className="space-y-8">
      <div className="container mx-auto p-4 space-y-10">
        <SectionTitle
          title="Category List"
          path="/learninghub/course-categories"
        />
        {/* Categories Grid */}
        {error && <ErrorBlock message={error?.message} />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, index) => <CategoryBlockSkeleton key={index} />)
            : categories?.slice(0, 8)?.map((category, i) => {
                const icon = icons[i + 1] || <Code />;
                const validURL = isValidUrl(category.icon);
                return (
                  <Link
                    key={i}
                    href={`/learninghub/course-categories/${category?.id}?category=${category?.name}`}
                    className="p-4 bg-white rounded-lg hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {validURL ? (
                        <div className=" flex items-center justify-center rounded text-white bg-purple-400/10 size-11">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={30}
                            height={30}
                            className="aspect-square"
                          />
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center rounded text-slate-600 bg-purple-400/10  size-11">
                          {icon}
                        </div>
                      )}

                      <h3 className="font-semibold text-lg">{category.name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.total_course || 10 + i} Courses{" "}
                      {category.is_bootcamp && "| 3 BootCamps"}
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Tutor Plans */}
      </div>
    </div>
  );
}
