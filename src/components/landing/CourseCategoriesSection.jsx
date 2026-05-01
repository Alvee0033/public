import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Lightbulb,
  School,
  BookText,
  Sparkles,
  BrainCircuit,
  MapPin,
} from "lucide-react";
import axios from "@/lib/axios";

// Helper function to get the appropriate icon based on category name or id
const getCategoryIcon = (category) => {
  const name = category.name.toLowerCase();

  // Grade levels
  if (name.includes("grade") || /^\d+(st|nd|rd|th)/.test(name)) {
    return <GraduationCap className="h-5 w-5" />;
  }

  // Subject areas
  if (name.includes("science")) {
    return <FlaskConical className="h-5 w-5" />;
  }
  if (name.includes("math")) {
    return <Calculator className="h-5 w-5" />;
  }
  if (name.includes("social studies")) {
    return <Globe className="h-5 w-5" />;
  }
  if (name.includes("english") || name.includes("language arts")) {
    return <BookOpen className="h-5 w-5" />;
  }

  // Special programs
  if (name.includes("religion")) {
    return <Heart className="h-5 w-5" />;
  }
  if (name.includes("sport") || name.includes("fitness")) {
    return <Dumbbell className="h-5 w-5" />;
  }
  if (name.includes("music") || name.includes("dance")) {
    return <Music className="h-5 w-5" />;
  }
  if (name.includes("test prep")) {
    return <BookText className="h-5 w-5" />;
  }
  if (name.includes("coding") || name.includes("robot")) {
    return <Code className="h-5 w-5" />;
  }
  if (name.includes("teacher") || name.includes("training")) {
    return <Users className="h-5 w-5" />;
  }
  if (name.includes("language") || name.includes("learning")) {
    return <Languages className="h-5 w-5" />;
  }
  if (name.includes("leadership") || name.includes("mentor")) {
    return <Target className="h-5 w-5" />;
  }

  // Default icon for anything else
  return <School className="h-5 w-5" />;
};

// Legacy icon map for backward compatibility
const iconMap = {
  "public-speaking": <Mic className="h-5 w-5" />,
  "grade-8": <GraduationCap className="h-5 w-5" />,
  "grade-7": <GraduationCap className="h-5 w-5" />,
  "grade-6": <GraduationCap className="h-5 w-5" />,
  "leadership-mentoring": <Target className="h-5 w-5" />,
  "language-learning": <Languages className="h-5 w-5" />,
  "teachers-training": <Users className="h-5 w-5" />,
  "coding-robotics": <Code className="h-5 w-5" />,
  "test-prep": <BookOpen className="h-5 w-5" />,
  "music-dance": <Music className="h-5 w-5" />,
  "sports-fitness": <Dumbbell className="h-5 w-5" />,
  religion: <Heart className="h-5 w-5" />,
  "english-language-arts": <BookOpen className="h-5 w-5" />,
  "social-studies": <Globe className="h-5 w-5" />,
  mathematics: <Calculator className="h-5 w-5" />,
  science: <FlaskConical className="h-5 w-5" />,
};

// Keep only a single blue palette so every category uses the blue shade by default
// and a lighter blue on hover.
const colorPalette = [
  {
    bg: "bg-primaryColor",
    hover: "hover:bg-[#4723A8]",
    iconBg: "bg-white/20",
    text: "text-white",
  },
];

const pickColorForCategory = (category) => {
  const key = String(category.id ?? category.name ?? Math.random());
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

export default function CourseCategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await axios.get("/course-categories", {
          params: {
            limit: 1000,
            pagination: false,
            sort: JSON.stringify({ id: "ASC" }),
          },
        });
        setCategories(res.data?.data || []);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveTab(categoryId);
    router.push(`/courses/${categoryId}`);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-4">
              Course Categories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of courses designed for every
            learning need
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex flex-wrap justify-center gap-3 mb-12 overflow-x-auto scrollbar-none py-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {loading ? (
              <span className="text-gray-400 text-sm px-4 py-2">
                Loading...
              </span>
            ) : categories.length === 0 ? (
              <span className="text-gray-400 text-sm px-4 py-2">
                No categories found
              </span>
            ) : (
              categories.map((category) => {
                const palette = pickColorForCategory(category);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === category.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : `${palette.bg} ${palette.text} ${palette.hover} shadow-sm`
                    }`}
                    style={{ minWidth: 120 }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-full ${palette.iconBg} ${palette.text}`}
                      >
                        {getCategoryIcon(category)}
                      </span>
                      <span className="whitespace-nowrap">{category.name}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
          {/* View All Category Courses Button */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-primaryColor hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={() => router.push("/learninghub/course-list")}
            >
              View All Category Courses
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
