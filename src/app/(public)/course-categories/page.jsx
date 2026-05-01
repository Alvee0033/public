"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  GraduationCap,
  Mic,
  Languages,
  Code,
  Music,
  Dumbbell,
  Heart,
  Calculator,
  FlaskConical,
  BookOpen,
  Globe,
  Target,
  Users,
  BookText,
  School,
} from "lucide-react";

// Helper function to get the appropriate icon based on category name
const getCategoryIcon = (category) => {
  if (!category?.name) return <School className="h-6 w-6 text-slate-700" />;
  const name = category.name.toLowerCase();

  if (name.includes("grade") || /^\d+(st|nd|rd|th)/.test(name)) {
    return <GraduationCap className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("science")) {
    return <FlaskConical className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("math")) {
    return <Calculator className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("social studies")) {
    return <Globe className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("english") || name.includes("language arts")) {
    return <BookOpen className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("religion")) {
    return <Heart className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("sport") || name.includes("fitness")) {
    return <Dumbbell className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("music") || name.includes("dance")) {
    return <Music className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("test prep")) {
    return <BookText className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("coding") || name.includes("robot")) {
    return <Code className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("teacher") || name.includes("training")) {
    return <Users className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("language") || name.includes("learning")) {
    return <Languages className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("leadership") || name.includes("mentor")) {
    return <Target className="h-6 w-6 text-slate-700" />;
  }
  if (name.includes("public speaking")) {
    return <Mic className="h-6 w-6 text-slate-700" />;
  }
  return <School className="h-6 w-6 text-slate-700" />;
};

// Use a small palette of color classes and assign deterministically so
// there are no hard-coded/dummy category names in the component.
const colorClasses = [
  "bg-blue-50 hover:bg-blue-100 border-blue-200",
  "bg-purple-50 hover:bg-purple-100 border-purple-200",
  "bg-green-50 hover:bg-green-100 border-green-200",
  "bg-orange-50 hover:bg-orange-100 border-orange-200",
  "bg-red-50 hover:bg-red-100 border-red-200",
  "bg-teal-50 hover:bg-teal-100 border-teal-200",
  "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
  "bg-pink-50 hover:bg-pink-100 border-pink-200",
  "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
  "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
];

const getColorForCategory = (category, index) => {
  // If a category name exists, hash it to pick a color deterministically.
  if (category && category.name) {
    let hash = 0;
    for (let i = 0; i < category.name.length; i++) {
      hash = (hash << 5) - hash + category.name.charCodeAt(i);
      hash |= 0; // convert to 32bit int
    }
    const idx = Math.abs(hash) % colorClasses.length;
    return colorClasses[idx];
  }
  // Fallback to index-based selection
  return colorClasses[index % colorClasses.length];
};

export default function CourseCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/course-categories", {
          params: {
            limit: 1000,
            pagination: false,
            sort: JSON.stringify({ id: "ASC" }),
          },
        });
        setCategories(res.data.data || []);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle card click to redirect
  const handleCategoryClick = (categoryId) => {
    router.push(`/courses/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Explore Our Course Categories
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From early grades to advanced skills, we have courses for everyone.
          </p>
        </div>

        {/* Course Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-40 bg-gray-100" />
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No categories found.
            </div>
          ) : (
            categories.map((category, index) => {
              const color = getColorForCategory(category, index);
              return (
                <Card
                  key={category.id || index}
                  className={`${color} border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
                  onClick={() => handleCategoryClick(category.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCategoryClick(category.id);
                    }
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        {getCategoryIcon(category)}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-slate-600 text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-6">
            Ready to start your learning journey?
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={() => router.push("/learninghub/course-list")}
          >
            Browse All Courses
          </button>
        </div>
      </div>
    </div>
  );
}
