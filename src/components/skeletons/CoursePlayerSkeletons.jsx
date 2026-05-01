export function VideoPlayerSkeleton() {
    return (
        <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg"></div>
    );
}

export function CourseContentsSkeleton() {
    return (
        <div className="p-4 space-y-4">
            {/* Module headers */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="pl-4 space-y-2">
                        {/* Lessons */}
                        {[1, 2, 3].map((j) => (
                            <div key={j} className="h-5 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CourseDescTabsSkeleton() {
    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                ))}
            </div>
            {/* Tab content */}
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
        </div>
    );
}