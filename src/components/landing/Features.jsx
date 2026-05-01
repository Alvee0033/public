import { cn } from "@/lib/utils";
import { Award, BookOpen, Brain, ClipboardCheck, MessageSquare, Smartphone, Video, Zap } from "lucide-react";
// import {
//     IconAdjustmentsBolt,
//     IconCloud,
//     IconCurrencyDollar,
//     IconEaseInOut,
//     IconHeart,
//     IconHelp,
//     IconRouteAltLeft,
//     IconTerminal2,
// } from "@tabler/icons-react";

export default function FeaturesSection() {
    const features = [
        {
            title: "AI-Powered Personalization",
            description: "Adaptive learning paths that adjust to your progress and style.",
            icon: <Brain />,
        },
        {
            title: "24/7 AI Tutor Support",
            description: "Get instant explanations and assistance anytime, anywhere.",
            icon: <MessageSquare />,
        },
        {
            title: "Automated Assessments",
            description: "AI-generated quizzes and instant grading to track your progress.",
            icon: <ClipboardCheck />,
        },
        {
            title: "Interactive Video Lessons",
            description: "Engage with AI-enhanced video lectures and real-time insights.",
            icon: <Video />,
        },
        {
            title: "Gamified Learning Experience",
            description: "Earn badges, level up, and stay motivated with AI-driven rewards.",
            icon: <Award />,
        },
        {
            title: "Seamless Multi-Device Sync",
            description: "Learn on the go—your progress is always in sync across devices.",
            icon: <Smartphone />,
        },
        {
            title: "AI-Powered Notes & Summaries",
            description: "Automatically generated notes and summaries for quick revision.",
            icon: <BookOpen />,
        },
        {
            title: "And Much More...",
            description: "Because AI keeps evolving, and so does your learning experience.",
            icon: <Zap />,
        },
    ];

    return (
        <div className="py-10 container mt-4">
            <h2 className="text-2xl lg:text-4xl text-clip bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold container mx-auto text-center">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  py-10 relative group/feature",
                (index === 0 || index === 4) && "lg:border-l",
                index < 4 && "lg:border-b"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-blue-500 ">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300  group-hover/feature:bg-brand transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 ">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
