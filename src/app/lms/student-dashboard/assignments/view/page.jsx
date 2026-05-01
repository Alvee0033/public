"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/lib/axios";
import { ArrowLeft, Download, FileText, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import useSWR from "swr";

const AssignmentSkeleton = () => (
  <Card className="shadow-md animate-pulse">
    <CardHeader>
      <CardTitle>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      </CardTitle>
      <CardDescription>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-2 w-full md:w-2/3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-full md:w-1/3 h-32 bg-gray-200 rounded-md"></div>
      </div>
      <div className="flex items-center gap-4 mt-6">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
        <div className="ml-auto h-10 bg-gray-200 rounded w-40"></div>
      </div>
    </CardContent>
  </Card>
);

export default function AssignmentViewPage() {
  // Drag and drop state
  const [dragActive, setDragActive] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const assignmentId = searchParams.get("id");

  // File upload state
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const truncateUrl = (url, maxLength = 25) => {
    if (!url) return "No attachment";

    // Extract filename
    const filename = url.split("/").pop();

    // If filename is short enough, return as-is
    if (filename.length <= maxLength) return filename;

    // Split filename and extension
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) {
      // No extension - just truncate
      return `${filename.substring(0, maxLength - 3)}...`;
    }

    const name = filename.substring(0, lastDotIndex);
    const ext = filename.substring(lastDotIndex);

    // Calculate how much of the name we can show
    const maxNameLength = maxLength - ext.length - 3; // 3 for the ellipsis
    const truncatedName = name.substring(0, maxNameLength);

    return `${truncatedName}...${ext}`;
  };

  const fetcher = async (id) => {
    if (!id) return null;
    const res = await axios.get(
      `/student-course-assignments?limit=1000&filter={"id":${id}}`
    );
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
    () => fetcher(assignmentId)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AssignmentSkeleton />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load assignment.
      </div>
    );
  }
  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No assignment found.
      </div>
    );
  }

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  // Handle submit
  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!selectedFile) {
      setErrorMsg("Please select a file to upload.");
      return;
    }
    setUploading(true);
    try {
      // 1. Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      const uploadRes = await axios.post("/file-cloudinary/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = uploadRes?.data?.data?.data?.url;
      if (!fileUrl) throw new Error("File upload failed");

      // 2. Patch assignment with file URL
      await axios.patch(`/student-course-assignments/${assignmentId}`, {
        attachment: fileUrl,
        submission_date: new Date().toISOString(),
      });
      setSuccessMsg("File uploaded and assignment updated successfully.");
      // 3. Refetch assignment data so attachment field updates
      if (mutate) await mutate();

      // 4. Check submission state and redirect
      // Optionally show a loading modal here
      // Simulate checking submission (replace with actual API if needed)
      setTimeout(() => {
        router.replace(`/lms/student-dashboard/assignments/submission?id=${assignmentId}`);
      }, 1000);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white px-2 py-2 sm:px-4 sm:py-3 border-b w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h1 className="font-semibold text-lg truncate">
              {assignment.title || "Assignment Title"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>
                Submission Deadline: {assignment.due_date
                  ? new Date(assignment.due_date).toLocaleDateString()
                  : "N/A"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                Instructor: {assignment.assigned_by_tutor || "Not assigned yet"}
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {assignment.assignment_points || assignment.score || 0} Points
              </Badge>
            </div>
          </div>

          <div className="flex items-center mt-2 sm:mt-0">
            <Button
              className="relative overflow-hidden text-white w-full sm:w-auto"
              style={{
                background:
                  "linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)",
              }}
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit Now"}
            </Button>
            {errorMsg && (
              <div className="text-red-500 text-xs mt-2">{errorMsg}</div>
            )}
            {successMsg && (
              <div className="text-green-600 text-xs mt-2">{successMsg}</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6 flex-1">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Assignment Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Assignment Overview
              </h2>

              <div className="text-gray-600 max-w-xs">
                {assignment.description ? (
                  <span className="line-clamp-2">
                    {assignment.description.replace(/<[^>]+>/g, "").trim() ||
                      "No description"}
                  </span>
                ) : (
                  <span className="text-gray-400">No description</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Course Contents */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h3 className="font-semibold mb-3 sm:mb-4">Course Contents</h3>

              <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setSelectedFile(e.dataTransfer.files[0]);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }
                }}
              >
                <Upload
                  className={`w-8 h-8 mx-auto mb-2 ${dragActive ? "text-blue-500" : "text-gray-400"
                    }`}
                />
                <p className="text-gray-500 mb-4">
                  Drag and drop file here or click below
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mb-4 block mx-auto"
                  disabled={uploading}
                  style={{ display: "none" }}
                  id="file-upload-input"
                />
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 bg-transparent w-full sm:w-auto"
                  onClick={() =>
                    document.getElementById("file-upload-input").click()
                  }
                  disabled={uploading}
                >
                  {selectedFile ? selectedFile.name : "Add Attachment"}
                </Button>
                {dragActive && (
                  <div className="text-blue-600 mt-2 text-sm">
                    Drop your file here...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h4 className="font-medium mb-3 sm:mb-4">Attachment</h4>

              <div className="space-y-3">
                {assignment.attachment ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">
                          {assignment.attachment
                            ? truncateUrl(assignment.attachment)
                            : "Assignment Attachment"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(assignment.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          let filename = `${assignment.title || "assignment"}.pdf`;
                          try {
                            const response = await fetch(assignment.attachment);
                            const blob = await response.blob();
                            const pdfBlob = new Blob([blob], {
                              type: "application/pdf",
                            });
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(pdfBlob);
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(link.href);
                          } catch (err) {
                            alert("Failed to download file as PDF.");
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">No attachments</p>
                        <p className="text-xs text-gray-500">N/A</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
