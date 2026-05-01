"use client";
import axios from "axios";
import { Check, CircleCheckBig, Clock8, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const AssignmetnSubmittedpage = () => {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("id");
  const fetchAssignment = async (id) => {
    if (!id) return null;
    const res = await axios.get(
      `/student-course-assignments?limit=10000&filter={"id":${id}}`
    );
    console.log("res", res);
    const arr = res?.data?.data || [];
    return arr.length > 0 ? arr[0] : null;
  };
  const {
    data: assignment,
    error,
    isLoading,
    mutate,
  } = useSWR(
    assignmentId ? ["student-course-assignments-detail", assignmentId] : null,
    () => fetchAssignment(assignmentId)
  );

  return (
    <div>
      <div className="flex flex-row justify-start bg-gradient-to-r from-green-400 to-green-700 rounded-t-xl px-4 py-4 mt-6">
        <span className="flex items-center justify-center w-20 h-20 bg-green-500 rounded-full">
          <CircleCheckBig className="text-white w-15 h-15 px-2 py-2 bg-green-400 rounded-full" />
        </span>
        <span className="flex flex-col ml-4">
          <h1 className="text-white flex flex-row">
            <span className="flex items-center justify-center w-10 h-10 mr-2">
              <Check className="bg-gradient-to-r from-green-500 to-green-800 shadow-md" />
            </span>
            <span className="text-4xl">Submission Successful</span>
          </h1>
          <p1 className="text-white text-sm mt-2">
            Your assignment has been submitted successfully
          </p1>
        </span>
      </div>
      <div className="shadow-md bg-white p-6">
        <div className="shadow-md bg-gray-300 p-4 rounded-lg">
          <h1 className="mt-2">
            <strong>{assignment?.title || "N/A"} </strong>
          </h1>
          <p className="mt-2 flex flex-row">
            <span className="flex flex-row">
              <strong className="text-sm text-gray-500">
                Submission Date:
              </strong>
              <strong className="text-sm text-gray-400 ml-2">
                {new Date(assignment?.submission_date).toLocaleDateString() ||
                  "N/A"}
              </strong>
            </span>
            <span className="flex flex-row px-20">
              <strong className="text-sm text-gray-500 ml-4">
                <p>Max points:</p>
              </strong>
              <strong className="text-sm text-gray-400 ml-2">
                {assignment?.assignment_points || "N/A"}
              </strong>
            </span>
          </p>
        </div>
        <div className="flex flex-row shadow-md bg-blue-50 p-4 mt-4 rounded-lg border border-blue-400">
          <span className="mt-0.5">
            <Clock8 className="text-blue-600 w-6 h-6" />
          </span>
          <span>
            {assignment?.feedback ? (
              <h1 className="text-lg font-semibold text-blue-600 ml-2">
                Your tutor has given you feedback
              </h1>
            ) : (
              <h1 className="text-lg font-semibold text-blue-600 ml-2">
                Your tutor has not given you feedback yet
              </h1>
            )}
          </span>
        </div>

        <div className="shadow-md bg-gray-100 p-4 mt-4 rounded-lg">
          <strong className="text-xl">Tutors response:</strong>
          <p className="text-sm text-gray-600 mt-2">
            {assignment?.feedback || "No feedback provided yet."}
          </p>
        </div>

        <div className="mt-4">Your Submission</div>
        <div className="shadow-md bg-gray-100 p-4 mt-2 rounded-lg">
          <h1 className="text-lg font-semibold">
            {assignment?.attachment ? (
              <button
                className="text-blue-600 hover:underline flex items-center"
                onClick={async () => {
                  try {
                    const response = await fetch(assignment.attachment);
                    const arrayBuffer = await response.arrayBuffer();
                    // Try to get file extension from URL
                    const urlParts = assignment.attachment
                      .split("?")[0]
                      .split("/");
                    const filename = urlParts[urlParts.length - 1];
                    let ext = "";
                    if (filename.includes(".")) {
                      ext = filename.substring(filename.lastIndexOf("."));
                    }
                    // Get MIME type from response or fallback
                    let mimeType =
                      response.headers.get("content-type") ||
                      "application/octet-stream";
                    // If no extension, try to guess from MIME type
                    if (!ext) {
                      if (mimeType.includes("pdf")) ext = ".pdf";
                      else if (mimeType.includes("image")) ext = ".jpg";
                      else if (mimeType.includes("msword")) ext = ".doc";
                      else if (
                        mimeType.includes(
                          "vnd.openxmlformats-officedocument.wordprocessingml.document"
                        )
                      )
                        ext = ".docx";
                      else if (mimeType.includes("video")) ext = ".mp4";
                    }
                    const downloadName = `${
                      assignment?.title || "submission"
                    }${ext}`;
                    const blob = new Blob([arrayBuffer], { type: mimeType });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = downloadName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                  } catch (err) {
                    alert("Failed to download file.");
                  }
                }}
              >
                <FileText className="inline-block mr-2" />
                <span className="text-blue-600">
                  {assignment?.title} submission
                </span>
              </button>
            ) : (
              "No attachment submitted."
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AssignmetnSubmittedpage;
