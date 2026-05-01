import { Skeleton } from "../ui/skeleton";

export default function CategoryBlockSkeleton() {
    return (
        <div className="relative aspect-square rounded-lg border bg-card  shadow-sm flex items-center justify-center flex-col p-10">
            <Skeleton className="animate-pulse size-16 rounded-full" />
            <Skeleton className="animate-pulse mt-2 h-6 w-3/4" />
            <Skeleton className="animate-pulse mt-2 h-3 w-full" />
            <Skeleton className="animate-pulse mt-2 h-3 w-full" />
        </div>
    )
}
