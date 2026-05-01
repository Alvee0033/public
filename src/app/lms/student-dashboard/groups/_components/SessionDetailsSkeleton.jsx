const SessionDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Header Skeleton */}
          <div className="border-b border-gray-100 px-8 py-6">
            <div className="space-y-4">
              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-8 w-80 bg-gray-300 rounded"></div>
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-8 space-y-8">
            {/* Session Info */}
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            {/* Timing Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-gray-300 rounded-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                        <div className="h-6 w-32 bg-gray-400 rounded"></div>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Session Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-28 bg-gray-300 rounded"></div>
              <div className="h-14 w-full bg-gray-200 rounded-xl"></div>
            </div>

            {/* Participants Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-6 w-32 bg-gray-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-80">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default SessionDetailsSkeleton
