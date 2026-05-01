// Trending courses data
import {
  Award,
  Building,
  Cpu,
  GraduationCap,
  Laptop,
  School,
  ShoppingCart,
  Trophy,
} from "lucide-react";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export const trendingCourses = [
  {
    id: 1,
    title: "Advanced Mathematics for High School",
    description:
      "Master complex mathematical concepts with our comprehensive course designed for grades 9-12.",
    image: "/images/advanced-mathematics.png",
    category: "Mathematics",
    rating: 4.9,
    duration: "12 weeks",
    price: "$299",
  },
  {
    id: 2,
    title: "Physics Lab Experiments",
    description:
      "Hands-on physics experiments with virtual lab simulations and real-world applications.",
    image: "/images/physics-lab-experiments.png",
    category: "Science",
    rating: 4.2,
    duration: "10 weeks",
    price: "$249",
  },
  {
    id: 3,
    title: "Python Programming for Kids",
    description:
      "A fun introduction to Python programming with games and interactive projects for ages 10-14.",
    image: "/images/python-programming-for-kids.png",
    category: "Coding",
    rating: 4.9,
    duration: "8 weeks",
    price: "$199",
    hot: true,
  },
  {
    id: 4,
    title: "Creative Writing Workshop",
    description:
      "Develop storytelling skills and unleash creativity through guided writing exercises and feedback.",
    image: "/images/creative-writing-workshop.png",
    category: "Language Arts",
    rating: 4.1,
    duration: "6 weeks",
    price: "$149",
  },
];

// Brooklyn courses data
export const brooklynCourses = [
  {
    id: 1,
    title: "Advanced Calculus Workshop",
    description:
      "Weekend intensive calculus program for high school students preparing for AP exams.",
    image: "/images/advanced-mathematics.png",
    provider: "Brooklyn Tech",
    rating: 4.9,
    reviews: 56,
    location: "Park Slope",
    price: "$199",
  },
  {
    id: 2,
    title: "Creative Writing for Teens",
    description:
      "Express yourself through poetry, short stories, and creative non-fiction with published authors.",
    image: "/images/creative-writing-workshop.png",
    provider: "Brooklyn Writers",
    rating: 4.8,
    reviews: 42,
    location: "Williamsburg",
    price: "$175",
  },
  {
    id: 3,
    title: "App Development Bootcamp",
    description:
      "Learn to build mobile apps in this intensive weekend program for middle and high school students.",
    image: "/images/python-programming-for-kids.png",
    provider: "BK Code Academy",
    rating: 5.0,
    reviews: 28,
    location: "DUMBO",
    price: "$249",
    new: true,
  },
  {
    id: 4,
    title: "Digital Art & Animation",
    description:
      "Create stunning digital artwork and animations using professional tools and techniques.",
    image: "/images/digital-art-fundamentals.png",
    provider: "Brooklyn Arts",
    rating: 4.7,
    reviews: 35,
    location: "Bushwick",
    price: "$225",
  },
];

// Brooklyn stores data
export const brooklynStores = [
  {
    id: 1,
    title: "Brooklyn School Supply Center",
    description:
      "Complete range of school supplies, art materials, and educational resources for all grade levels.",
    icon: <ShoppingCart className="h-20 w-20 text-white" />,
    location: "Downtown Brooklyn",
    features: ["ScholarPASS accepted", "Teacher discounts available"],
    gradientFrom: "from-blue-400 to-indigo-300",
    buttonGradient:
      "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
    iconColor: "text-blue-600",
    flagship: true,
  },
  {
    id: 2,
    title: "BK Tech Hub",
    description:
      "Educational technology, computers, tablets, and accessories with expert setup assistance.",
    icon: <Laptop className="h-20 w-20 text-white" />,
    location: "Williamsburg",
    features: ["Student pricing available", "Free tech workshops"],
    gradientFrom: "from-indigo-400 to-purple-300",
    buttonGradient:
      "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
    iconColor: "text-indigo-600",
    new: true,
  },
  {
    id: 3,
    title: "Brooklyn Robotics & STEM",
    description:
      "Robotics kits, coding tools, science equipment, and hands-on STEM learning materials.",
    icon: <Cpu className="h-20 w-20 text-white" />,
    location: "DUMBO",
    features: ["Weekend workshops", "Robotics club discounts"],
    gradientFrom: "from-purple-400 to-blue-300",
    buttonGradient:
      "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
    iconColor: "text-purple-600",
  },
];

// Brooklyn schools data
export const brooklynSchools = [
  {
    id: 1,
    title: "Brooklyn Tech High School",
    description:
      "Specialized high school focusing on STEM education with advanced placement courses and state-of-the-art facilities.",
    location: "Fort Greene",
    rating: 4.9,
    reviews: 320,
    features: [
      {
        icon: <Building className="h-4 w-4 text-blue-600" />,
        text: "Grades 9-12",
      },
      {
        icon: <GraduationCap className="h-4 w-4 text-blue-600" />,
        text: "98% College Acceptance Rate",
      },
      {
        icon: <Award className="h-4 w-4 text-blue-600" />,
        text: "Specialized High School",
      },
    ],
    gradientFrom: "from-blue-600 to-indigo-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    icon: <Trophy className="h-8 w-8 text-blue-600" />,
    rank: "Top Ranked",
  },
  {
    id: 2,
    title: "Brooklyn Latin School",
    description:
      "Classical liberal arts curriculum with emphasis on humanities, Latin, and debate in a rigorous academic environment.",
    location: "Williamsburg",
    rating: 4.8,
    reviews: 285,
    features: [
      {
        icon: <Building className="h-4 w-4 text-indigo-600" />,
        text: "Grades 9-12",
      },
      {
        icon: <GraduationCap className="h-4 w-4 text-indigo-600" />,
        text: "100% College Acceptance Rate",
      },
      {
        icon: <Award className="h-4 w-4 text-indigo-600" />,
        text: "International Baccalaureate",
      },
    ],
    gradientFrom: "from-indigo-600 to-purple-600",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    icon: <School className="h-8 w-8 text-indigo-600" />,
    rank: "#2 Ranked",
  },
];
