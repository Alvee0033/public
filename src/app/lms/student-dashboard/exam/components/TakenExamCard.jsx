import { formatDateTime } from "@/config/dateformate";
import { Inter, Poppins } from "next/font/google";
import Link from "next/link";

const { RichTextDescription } = require("@/components/rich-text-description");
const {
  AcademicCapIcon,
  ClockIcon,
  ArrowRightCircleIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} = require("@heroicons/react/24/outline");
const { UserCircleIcon } = require("lucide-react");
const { BookCheck } = require("lucide-react");

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const TakenExamCard = ({ exam, setShowStartModal }) => {
  const e = exam.exam || exam;

  const getExamTypeIcon = () => {
    return e?.remote_or_onsite ? (
      <ComputerDesktopIcon className="h-5 w-5 text-[var(--primaryColor)]" />
    ) : (
      <BuildingOfficeIcon className="h-5 w-5 text-[var(--secondaryColor)]" />
    );
  };

  const getExamTypeLabel = () => {
    return e?.remote_or_onsite ? "Remote" : "On-site";
  };

  return (
    <div
      key={exam?.id}
      className={`
        w-full
        bg-gradient-to-br from-[var(--primaryColor)]/10 to-[var(--secondaryColor)]/10
        rounded-2xl shadow-md
        p-4 sm:p-6
        flex flex-col md:flex-row
        gap-4
        border-2 border-transparent hover:border-[var(--primaryColor)]
        transition-all
        min-w-0
      `}
    >
      {/* Left: Icon and Status */}
      <div className="flex flex-col items-center md:items-start gap-3 min-w-[80px]">
        <div className="bg-white rounded-full shadow flex items-center justify-center w-16 h-16 border-2 border-[var(--primaryColor)]">
          <AcademicCapIcon className="h-8 w-8 text-[var(--primaryColor)]" />
        </div>
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-semibold
            bg-green-100 text-green-700
            mt-2
            text-center
            w-full
          `}
        >
          Taken
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-gray-600 mt-1">
          {getExamTypeIcon(exam)}
          {getExamTypeLabel(exam)}
        </span>
      </div>

      {/* Middle: Main Content */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3
            className={`${poppins.className} font-bold text-lg sm:text-xl text-gray-900 truncate`}
          >
            {exam?.title}
          </h3>
        </div>
        <div
          className={`${inter.className} text-gray-700 text-sm sm:text-base mb-1`}
        >
          <RichTextDescription
            content={exam?.description || "No description available."}
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1 shadow-sm">
            <BookCheck className="h-4 w-4 text-[var(--primaryColor)]" />
            <span className="text-sm font-medium text-gray-700">
              {exam?.exam?.total_score || exam?.exam_points || "N/A"} Points
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1 shadow-sm">
            <UserCircleIcon className="h-4 w-4 text-[var(--secondaryColor)]" />
            <span className="text-sm font-medium text-gray-700">
              Assigned by: {exam?.assigned_by_tutor_id || "System"}
            </span>
          </div>
          {exam?.course_id && (
            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1 shadow-sm">
              <AcademicCapIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Course: {exam?.course_name || "N/A"}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1 shadow-sm">
            <ClockIcon className="h-4 w-4 text-green-600" />
            <span className="text-sm">
              <span className="font-medium">Scheduled: </span>
              {exam?.schedule_exam_date_time
                ? formatDateTime(exam.schedule_exam_date_time)
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col items-end justify-between min-w-[140px] gap-2">
        <Link
          href={`/lms/student-dashboard/exam/${exam?.exam?.id}/review`}
          className="w-full"
        >
          <button
            className={`${poppins.className} px-6 py-2.5 rounded-lg text-base font-semibold
              flex items-center gap-2 transition-all bg-green-500 text-white hover:bg-green-600 shadow-md w-full`}
          >
            Exam Review
            <DocumentTextIcon className="h-5 w-5" />
          </button>
        </Link>
        <button
          onClick={() => setShowStartModal && setShowStartModal(exam)}
          className={`${poppins.className} px-4 py-2 rounded-lg text-sm font-medium
              flex items-center gap-2 transition-all bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm w-full`}
          title="Retake Exam"
        >
          Retake Exam
          <ArrowRightCircleIcon className="h-4 w-4" />
        </button>
        {/* <button
          onClick={() => setShowStartModal(exam)}
          className={`${poppins.className} px-6 py-2.5 rounded-lg text-base font-semibold
            flex items-center gap-2 transition-all
            bg-[var(--primaryColor)] text-white hover:bg-[var(--secondaryColor)]
            shadow-md w-full`}
        >
          Start Again
          <ArrowRightCircleIcon className="h-5 w-5" />
        </button> */}
      </div>
    </div>
  );
};

export default TakenExamCard;
