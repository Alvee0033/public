import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  return (
    <Card
      className="
        group relative flex flex-col justify-between
        border border-neutral-200 dark:border-neutral-800
        rounded-2xl p-6
        bg-white dark:bg-neutral-900
        shadow-sm hover:shadow-md
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Subtle accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-800 to-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {category.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        {Array.isArray(category.description) ? (
          <CardDescription>
            <ul className="list-none space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              {category.description.map((d, idx) => (
                <li key={idx} className="flex items-start justify-center gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </CardDescription>
        ) : (
          <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
            {category.description}
          </CardDescription>
        )}

        <div className="mt-6">
          <Link href={`/scholarship-category/category-pages/${category.slug || category.id}`}>
            <Button
              size="sm"
              className="
                w-full sm:w-auto
                rounded-full px-5 py-2
                bg-green-900 hover:bg-green-500
                dark:bg-neutral-100 dark:hover:bg-neutral-200
                text-white dark:text-neutral-900
                font-medium transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;