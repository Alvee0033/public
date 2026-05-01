import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "./buttons/Button";

export default function SectionTitle({ children, path, title, btnTitle }) {
    return (
        <div className="flex justify-between items-center gap-4 sm:gap-6 my-6 sm:my-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primaryColor to-secondaryColor bg-clip-text text-transparent">
                {title}
            </h2>

            <Button
                className="group border-none bg-primaryColor text-white rounded-lg py-2 px-3 sm:px-4 text-sm sm:text-base flex items-center gap-1 transition-all duration-300 shadow-sm hover:shadow-md"
                asChild
                variant="brand2"
            >
                {children ? children : path ?
                    <Link href={path} className="flex items-center gap-1 ">
                        <span>{btnTitle || "View All"}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    : null}
            </Button>
        </div>
    )
}
