export default function CourseBlockSkeleton({ count = 6 }) {
  return (
    <div className="animate-pulse">
      <div className="h-[200px] bg-gray-200 rounded-t-lg"></div>
      <div className="p-5 border border-t-0 border-borderColor rounded-b-lg">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
