import { formatDateTime } from "@/config/dateformate";
import { Inter, Poppins } from "next/font/google";

const { RichTextDescription } = require("@/components/rich-text-description");
const {
  AcademicCapIcon,
  ClockIcon,
  ArrowRightCircleIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon,
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

function getExamStatus(exam) {
  try {
    const now = new Date();
    const start = exam.exam_started_at ? new Date(exam.exam_started_at) : null;
    const end = exam.exam_ended_at ? new Date(exam.exam_ended_at) : null;

    if (exam.is_taken)
      return { label: "Completed", class: "bg-green-100 text-green-800" };
    if (!start || !end)
      return { label: "Unknown", class: "bg-gray-100 text-gray-800" };
    if (now < start)
      return { label: "Upcoming", class: "bg-yellow-100 text-yellow-800" };
    if (now >= start && now <= end)
      return { label: "Available", class: "bg-blue-100 text-blue-800" };
    if (now > end && !exam.is_taken)
      return { label: "Expired", class: "bg-red-100 text-red-800" };
    return { label: "Unknown", class: "bg-gray-100 text-gray-800" };
  } catch (err) {
    return { label: "Unknown", class: "bg-gray-100 text-gray-800" };
  }
}

const ExamCard = ({ exam, setShowStartModal }) => {
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

  // Use new status logic
  const status = getExamStatus(exam);
  const canStart = status.label === "Available";
  const isExpired = status.label === "Expired";
  const buttonText =
    status.label === "Expired"
      ? "Expired"
      : status.label === "Available"
      ? "Start Now"
      : status.label === "Upcoming"
      ? "Not Available Yet"
      : status.label === "Completed"
      ? "Completed"
      : "Unavailable";

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
            ${status.class}
            mt-2
            text-center
            w-full
          `}
        >
          {status.label}
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
              <span className="font-medium">Start: </span>
              {exam?.exam_started_at
                ? formatDateTime(exam.exam_started_at)
                : formatDateTime(new Date.now())}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1 shadow-sm">
            <ClockIcon className="h-4 w-4 text-red-600" />
            <span className="text-sm">
              <span className="font-medium">End: </span>
              {exam?.exam_ended_at
                ? formatDateTime(exam.exam_ended_at)
                : formatDateTime(new Date.now())}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Start Button */}
      <div className="flex flex-col items-end justify-between min-w-[120px]">
        <button
          onClick={() => canStart && setShowStartModal(exam)}
          className={`
            ${poppins.className} px-6 py-2.5 rounded-lg text-base font-semibold
            flex items-center gap-2 transition-all
            ${
              canStart
                ? "bg-[var(--primaryColor)] text-white hover:bg-[var(--secondaryColor)] shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
            w-full mt-2
          `}
          disabled={!canStart}
          title={
            status.label === "Expired"
              ? "Exam expired"
              : status.label === "Upcoming"
              ? "Exam not available yet"
              : status.label === "Completed"
              ? "Exam already completed"
              : ""
          }
        >
          {buttonText}
          <ArrowRightCircleIcon className="h-5 w-5" />
        </button>
        {/* Retake button - always visible */}
        <button
          onClick={() => setShowStartModal && setShowStartModal(exam)}
          className={`
            ${poppins.className} px-4 py-2 rounded-lg text-sm font-medium
            flex items-center gap-2 transition-all
            bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm w-full mt-2
          `}
          title="Retake Exam"
        >
          Retake Exam
          <ArrowRightCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
