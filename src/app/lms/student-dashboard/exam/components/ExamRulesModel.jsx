"use client";
import axios from "axios";
import { Inter, Poppins } from "next/font/google";
import { useState } from "react";
import { useSelector } from "react-redux";

const { Button } = require("@/components/ui/button");
const {
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
} = require("@heroicons/react/24/outline");
const { default: Link } = require("next/link");

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const ExamRulesModal = ({ exam, onClose, showStartModal, onContinue }) => {
  const [acknowledgeRules, setAcknowledgeRules] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);
  const userId = useSelector((state) => state.user.userId);

  const handleStartExam = async (exam) => {
    const data = {
      title: exam.title || "",
      description: exam.description || "",
      exam_points: exam.total_score || 0,
      assign_date: exam.start_date_time || null,
      schedule_exam_date_time: exam.start_date_time || null,
      course_exam_or_learning_goal: exam.course_id !== undefined,
      student: userId,
      course: exam.course_id || null,
      exam: exam.id || null,
      exam_started_at: exam.start_date_time || null,
      exam_ended_at: exam.end_date_time || null,
      is_reviewed_by_tutor: exam.tutor_id ? true : false,
      course_module: null,
      course_lesson: null,
      assigned_by_tutor: exam.course_id || null,
      approved_by_employee: exam.primary_author_employee_id || null,
    };

    try {
      const res = await axios.post("/student-exams", data);
      if (res.response) {
        setDataStatus(true);
      }
    } catch (e) {
      console.error("Error starting exam:", e);
      setDataStatus(false);
    }
  };
  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white max-w-2xl rounded-xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`${poppins.className} text-xl font-semibold text-gray-900`}
            >
              {showStartModal?.title}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              {showStartModal?.exam_duration_minutes}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <QuestionMarkCircleIcon className="h-4 w-4" />
              {showStartModal?.exam_questions?.length} Questions
            </span>
            <span className="flex items-center gap-1">
              <DocumentTextIcon className="h-4 w-4" />
              {showStartModal?.course?.name}
            </span>
          </div>
        </div>

        {/* Rules Content */}
        <div className="p-6 space-y-6">
          <div>
            <h4
              className={`${poppins.className} text-lg font-semibold mb-4 text-gray-900`}
            >
              Before the Exam
            </h4>
            <ul className="space-y-3">
              {[
                {
                  number: 1,
                  title: "Preparation",
                  description:
                    "Ensure you have your necessary materials ready (e.g., pen, pencil, eraser, calculator if allowed).",
                },
                {
                  number: 2,
                  title: "Environment",
                  description:
                    "Choose a quiet, well-lit space free of distractions.",
                },
                {
                  number: 3,
                  title: "Technical Setup",
                  description:
                    "Check your internet connection and ensure your device is fully charged or plugged in.",
                },
              ].map((item) => (
                <li key={item?.number} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">
                      {item?.number}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item?.title}</p>
                    <p className="text-sm text-gray-600">{item?.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className={`${poppins.className} text-lg font-semibold mb-4 text-gray-900`}
            >
              During the Exam
            </h4>
            <ul className="space-y-3">
              {[
                {
                  number: 1,
                  title: "Time Management",
                  description:
                    "Monitor the timer to manage your time effectively.",
                },
                {
                  number: 2,
                  title: "Prohibited Items",
                  description: "Do not use unauthorized materials or devices.",
                },
              ].map((item) => (
                <li key={item.number} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {item.number}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4
              className={`${poppins.className} text-sm font-semibold text-yellow-800 mb-2`}
            >
              Important Notes
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Your answers are automatically saved.</li>
              <li>• You cannot pause the exam once started.</li>
              <li>• Submit before the time runs out.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                onChange={() => setAcknowledgeRules((prev) => !prev)}
                checked={acknowledgeRules}
                type="checkbox"
                id="rules-agreement"
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <label
                htmlFor="rules-agreement"
                className="text-sm text-gray-600"
              >
                I acknowledge and agree to follow the exam rules
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium`}
              >
                Cancel
              </button>
              {onContinue ? (
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  disabled={!acknowledgeRules}
                  onClick={() => {
                    console.log("Start Pre-Test button clicked");
                    onContinue();
                  }}
                >
                  Start Pre-Test
                  <ArrowRightCircleIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  disabled={!acknowledgeRules}
                  onClick={() => handleStartExam(showStartModal)}
                >
                  <Link
                    href={`/lms/exam/${
                      showStartModal?.exam?.id || showStartModal?.id
                    }/start`}
                    className={
                      !acknowledgeRules ? "pointer-events-none opacity-50" : ""
                    }
                  >
                    Start Exam
                    <ArrowRightCircleIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRulesModal;
