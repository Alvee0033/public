"use client";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useCallback, useState, useRef } from "react";

// Local fallback initial query (was previously imported from @/lib/data)
const initialQuery = {
  pagination: true,
  limit: 10,
  skip: 0,
  sort: { id: -1 },
  filter: {},
  search: "",
};
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// title/category inputs removed — uploader now uses filename as title and default document type
import { fileUpload } from "@/lib/fileUpload";
import { FileText, Loader2, Upload, X } from "lucide-react";

export default function UploadedDocumentsPage() {
  // Get user from Redux state
  const user = useAppSelector((state) => state.auth.user);
  
  const { studentId } = useParams();
  const [resolvedStudentId, setResolvedStudentId] = useState(studentId || null);
  const [query, setQuery] = useState(initialQuery);
  const [documentsResult, setDocumentsResult] = useState({
    data: [],
    pagination: {},
    total: 0,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  // Delete confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDoc, setConfirmDoc] = useState({ id: null, title: "" });

  const openDeleteConfirm = (id, title) => {
    setConfirmDoc({ id, title: title || "Untitled" });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (confirmDoc.id) {
      await handleDelete(confirmDoc.id);
      setConfirmDoc({ id: null, title: "" });
    }
  };

  const fetchDocumentsBystudent = async (
    studentId,
    page = 1,
    pageLimit = 10,
    searchQuery = "",
    sortField = null,
    sortOrder = "desc",
    attempt = 0
  ) => {
    if (!studentId) throw new Error("student ID is missing");

    try {
      const filter = JSON.stringify({ student: parseInt(studentId, 10) });
      const params = new URLSearchParams({
        filter,
        pagination: true,
        page,
        limit: pageLimit,
      });
      if (searchQuery) params.append("search", searchQuery);
      // normalize sort to API example: {"id":"desc"}
      params.append("sort", JSON.stringify({ id: sortOrder }));

      const response = await axios.get(`/crm-documents?${params}`);
      return {
        data: response.data.data || [],
        total: response.data.pagination?.total || 0,
        pages: response.data.pagination?.pages || 1,
        pagination: response.data.pagination || {
          total: response.data.data?.length || 0,
          limit: pageLimit,
          skip: (page - 1) * pageLimit,
        },
        serverSort: true,
        clientSort: false,
        sortField: "id",
      };
    } catch (error) {
      console.error(
        "Failed to fetch documents for student:",
        error?.response?.data || error.message || error
      );
      toast.error(
        `Failed to load documents: ${
          error?.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  };

  const [clientSortFlag, setClientSortFlag] = useState(false);
  const [sortField, setSortField] = useState(null);

  const loadDocuments = useCallback(async () => {
    // Use student_id from Redux state
    let activeStudentId = studentId || (user?.student_id ? String(user.student_id) : null);

    if (!activeStudentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { limit, skip, search } = query;
      const page = Math.floor(skip / limit) + 1;
      toast.dismiss();
      const result = await fetchDocumentsBystudent(
        activeStudentId,
        page,
        limit,
        search
      );
      setClientSortFlag(result.clientSort);
      setSortField(result.sortField);
      setDocumentsResult({
        data: result.data || [],
        pagination: result.pagination || {},
        total: result.total || 0,
        pages: result.pages || 1,
      });
    } catch (err) {
      console.error("Failed to load documents:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [studentId, query]);

  useEffect(() => {
    // Ensure we have a student id: prefer route param, fallback to Redux user
    if (!resolvedStudentId && user?.student_id) {
      setResolvedStudentId(String(user.student_id));
    }
    loadDocuments();
  }, [loadDocuments, resolvedStudentId, user?.student_id]);

  useEffect(() => {
    // Check if viewing own profile using Redux user
    const compareId = resolvedStudentId || studentId || null;
    if (user?.student_id && compareId) {
      setIsOwnProfile(String(user.student_id) === String(compareId));
    } else {
      setIsOwnProfile(false);
    }
  }, [user?.student_id, resolvedStudentId, studentId]);

  const refetch = loadDocuments;

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await axios.get(
        `/crm-documents/${documentId}/download`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `document-${documentId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error(`Failed to download ${fileName}`);
    }
  };

  // Open document securely in a new tab using the auth-backed download endpoint
  const handleOpen = async (documentId, fileName) => {
    try {
      const response = await axios.get(
        `/crm-documents/${documentId}/download`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      // optional: revoke after a short delay to allow tab to load
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Error opening document:", error);
      toast.error("Failed to open document");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/crm-documents/${id}`);
      toast.success("Document deleted successfully");
      await loadDocuments();
    } catch (err) {
      console.error("Failed to delete document:", err);
      toast.error("Failed to delete document");
    }
  };

  // columns variable removed — page uses inline simple table rendering below
  const visibleDocs = (documentsResult?.data || []).filter(
    (doc) => String(doc.student_id) === String(resolvedStudentId || studentId)
  );

  return (
    <div className="space-y-6 mt-4 animate-in fade-in duration-500">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 animate-in slide-in-from-top duration-300">
          <h3 className="font-semibold flex items-center gap-2">
            <span className="text-red-500">⚠</span> Error loading documents
          </h3>
          <p className="mt-1 text-sm">
            {error.message || "An unknown error occurred"}
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-white to-violet-50/30 rounded-xl shadow-lg border border-violet-100 p-6 sm:p-8 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-violet-100">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Student Documents
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Student ID:{" "}
              <span className="font-medium text-violet-600">
                {resolvedStudentId || studentId || "—"}
              </span>
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium">
              {documentsResult.total || 0}{" "}
              {documentsResult.total === 1 ? "Document" : "Documents"}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
              <p className="text-sm text-gray-500 animate-pulse">
                Loading documents...
              </p>
            </div>
          </div>
        ) : (
          <>
            {visibleDocs.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-gradient-to-br from-violet-100 to-purple-100 p-8 rounded-full shadow-lg animate-bounce-slow">
                  <FileText className="h-12 w-12 text-violet-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800">
                  No documents yet
                </h4>
                <p className="text-sm text-gray-600 text-center max-w-md leading-relaxed">
                  {isOwnProfile
                    ? "You don't have any documents yet. Upload documents to attach files to your profile."
                    : "This student doesn't have any documents yet. You can upload documents to attach files to the student's profile."}
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload documents
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {visibleDocs.map((row, index) => (
                    <div
                      key={row.id}
                      className="group border border-violet-100 rounded-xl p-4 bg-white hover:bg-violet-50/50 hover:border-violet-300 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-violet-100 p-2 rounded-lg group-hover:bg-violet-200 transition-colors">
                            <FileText className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 group-hover:text-violet-700 transition-colors line-clamp-2">
                              {row.document_title ||
                                row.file_name ||
                                "Untitled"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(row.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow hover:shadow-md"
                          onClick={() =>
                            openDeleteConfirm(
                              row.id,
                              row.document_title || row.file_name
                            )
                          }
                        >
                          <span className="flex items-center justify-center gap-2">
                            <X className="h-4 w-4" />
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-hidden rounded-xl border border-violet-100 shadow-sm">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-violet-900">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-violet-600" />
                            Document
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-violet-900">
                          Date Added
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-violet-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-violet-50">
                      {visibleDocs.map((row, index) => (
                        <tr
                          key={row.id}
                          className="group hover:bg-violet-50/50 transition-all duration-200 animate-in slide-in-from-bottom"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-violet-100 p-2 rounded-lg group-hover:bg-violet-200 transition-colors">
                                <FileText className="h-5 w-5 text-violet-600" />
                              </div>
                              <div className="font-medium text-gray-800 group-hover:text-violet-700 transition-colors">
                                {row.document_title ||
                                  row.file_name ||
                                  "Untitled"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(row.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                              onClick={() =>
                                openDeleteConfirm(
                                  row.id,
                                  row.document_title || row.file_name
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        <div className="mt-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <DocumentUploader
            studentId={resolvedStudentId || studentId}
            refetch={refetch}
            open={uploadModalOpen}
            setOpen={setUploadModalOpen}
          />
        </div>
        {/* Delete confirmation dialog (uses app Dialog for consistent UI) */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md animate-in zoom-in duration-300">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="bg-red-100 p-2 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                Confirm Delete
              </DialogTitle>
              <DialogDescription className="text-base pt-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  "{confirmDoc.title}"
                </span>
                ?
                <div className="mt-2 text-red-600 font-medium">
                  This action cannot be undone.
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                className="hover:bg-gray-100 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-105"
              >
                Delete Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// DocumentUploader component (inlined so this page works standalone)
function DocumentUploader({ studentId, refetch, open, setOpen }) {
  // store only student_id from logged-in user for upload authorization
  const [sessionStudentId, setSessionStudentId] = useState(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const isUploadModalOpen = typeof open === "boolean" ? open : internalOpen;
  const setIsUploadModalOpen =
    typeof setOpen === "function" ? setOpen : setInternalOpen;
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);

  useEffect(() => {
    let mounted = true;
    // Use student_id from Redux user
    if (user?.student_id) {
      setSessionStudentId(user.student_id);
    }
    (async () => {
      try {
        const response = await axios.get("/master-document-types");
        if (response.data?.data?.length > 0) {
          if (mounted) setDocumentTypeOptions(response.data.data);
          return;
        }

        const defaultTypes = getDefaultDocumentTypes();
        const createResponse = await axios.post("/master-document-types", {
          name: defaultTypes[0].name,
          description: defaultTypes[0].description,
        });

        if (createResponse.data?.data) {
          if (mounted) setDocumentTypeOptions([createResponse.data.data]);
        }
      } catch (error) {
        console.error("Failed to fetch document types:", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getDefaultDocumentTypes = () => [
    { name: "General", description: "General documents" },
    { name: "Contract", description: "Contract documents" },
    { name: "Invoice", description: "Invoice documents" },
    { name: "Certificate", description: "Certificate documents" },
    { name: "Report", description: "Report documents" },
    { name: "Other", description: "Other documents" },
  ];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;

    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name} (max 10MB)`);
        return false;
      }

      return true;
    });

    const filesWithMetadata = validFiles.map((file) => ({
      file,
      // keep title as filename (without extension) but do not expose editing
      title: file.name.split(".")[0],
    }));

    setSelectedFiles(filesWithMetadata);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // removed category-to-type mapping; uploader will use default document type

  const createDocument = async (documentData) => {
    try {
      const payload = {
        document_title: documentData.title,
        file_binary_object_id: documentData.fileUrl,
        master_document_type: documentData.typeId,
        // Only send student field - backend will determine user from auth token
        student: documentData.studentId || null,
        document_status: documentData.status || 1,
      };

      const response = await axios.post("/crm-documents", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating document:", error);
      if (error.response?.data?.message?.includes("foreign key constraint")) {
        const constraintMatch =
          error.response.data.message.match(/FK_[a-z0-9]+/i);
        const constraint = constraintMatch ? constraintMatch[0] : "unknown";
        console.error(`Foreign key constraint violation: ${constraint}`);
        if (constraint.includes("master_document_type")) {
          throw new Error("Invalid document type. Please try again.");
        } else if (constraint.includes("student")) {
          throw new Error("Invalid student ID. Please try again.");
        } else if (constraint.includes("user")) {
          throw new Error("Invalid user ID. Please try again.");
        } else {
          throw new Error(
            "Failed to create document due to a database constraint."
          );
        }
      }

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create document"
      );
    }
  };

  const fetchDocuments = async (filters = {}) => {
    try {
      const queryParams = Object.keys(filters).length
        ? `?filter=${JSON.stringify(filters)}`
        : "";
      const response = await axios.get(`/crm-documents${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  };

  const saveFileUrlToLocalStorage = (url, name) => {
    try {
      const existingUrls = JSON.parse(
        localStorage.getItem("uploadedFileUrls") || "[]"
      );
      existingUrls.push({ url, name, timestamp: new Date().toISOString() });
      localStorage.setItem("uploadedFileUrls", JSON.stringify(existingUrls));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select at least one file to upload");
      return;
    }

    // uploaderStudentId should come from logged-in user's student_id (prefer sessionStudentId)
    const uploaderStudentId = sessionStudentId
      ? parseInt(sessionStudentId, 10)
      : studentId
      ? parseInt(studentId, 10)
      : null;

    if (!uploaderStudentId) {
      toast.error(
        "Upload blocked: unable to determine current student's ID. Please ensure you're viewing your student profile and logged in."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      let uploadedCount = 0;

      for (const fileData of selectedFiles) {
        let fileUrl = null;

        try {
          // Use axios-backed uploader which respects auth interceptors
          fileUrl = await fileUpload(fileData.file);

          if (!fileUrl) {
            throw new Error(`Failed to upload ${fileData.file.name}`);
          }

          const documentTitle =
            fileData.title || fileData.file.name || "Uploaded Document";
          const documentTypeId = await getDefaultDocumentType();

          if (!documentTypeId) {
            console.error("Failed to get a valid document type ID");
            throw new Error(
              "Failed to get a valid document type ID. Please try again."
            );
          }

          try {
            // Prefer the logged-in user's student_id from localStorage when creating documents
            const uploaderStudentId = sessionStudentId
              ? parseInt(sessionStudentId, 10)
              : studentId
              ? parseInt(studentId, 10)
              : null;

            await createDocument({
              title: documentTitle,
              fileUrl: fileUrl,
              typeId: documentTypeId,
              studentId: uploaderStudentId,
              status: 1,
            });

            toast.success(`Successfully uploaded ${fileData.file.name}`);
          } catch (error) {
            console.error("Error uploading document:", error);
            toast.error(error.message || "Upload failed");
            if (fileUrl) saveFileUrlToLocalStorage(fileUrl, fileData.file.name);
            throw error;
          }

          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
        } catch (error) {
          console.error(`Error processing ${fileData.file.name}:`, error);
          toast.error(`Failed to process ${fileData.file.name}`);
        }
      }

      // Refresh the document list after successful uploads
      if (refetch) await refetch();

      setSelectedFiles([]);
      setUploadProgress(0);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  const getDefaultDocumentType = async () => {
    if (documentTypeOptions && documentTypeOptions.length > 0)
      return documentTypeOptions[0].id;
    try {
      const response = await axios.get("/master-document-types");
      if (response.data?.data?.length > 0) {
        setDocumentTypeOptions(response.data.data);
        return response.data.data[0].id;
      }
    } catch (error) {
      console.error("Error fetching default document type:", error);
    }
    try {
      const defaultType = getDefaultDocumentTypes()[0];
      const createResponse = await axios.post("/master-document-types", {
        name: defaultType.name,
        description: defaultType.description,
      });
      if (createResponse.data?.data?.id) {
        setDocumentTypeOptions((old) =>
          old ? [...old, createResponse.data.data] : [createResponse.data.data]
        );
        return createResponse.data.data.id;
      }
    } catch (error) {
      console.error("Error creating default document type:", error);
    }
    console.error("Failed to get a default document type ID");
    return null;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Upload Student Documents
        </h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          multiple
          className="hidden"
        />

        {isUploading && (
          <div className="mb-4 animate-in slide-in-from-top duration-300">
            <div className="h-2.5 w-full bg-violet-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500 ease-out animate-pulse"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-center mt-2 text-violet-700 font-medium">
              Uploading {uploadProgress}%
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-violet-300 text-violet-700 hover:bg-violet-100 hover:text-violet-900 hover:border-violet-400 transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </Button>

          {selectedFiles.length > 0 && (
            <Button
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload{" "}
                  {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-violet-600 mt-3 text-center">
          Supported: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG (max 10MB)
        </p>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full text-xs border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-900 hover:border-violet-300 transition-all duration-300"
            onClick={async () => {
              try {
                await fetchDocuments({ student: parseInt(studentId, 10) });
                refetch();
                toast.success("Document list refreshed");
              } catch (error) {
                toast.error("Failed to fetch documents");
              }
            }}
            disabled={isUploading}
          >
            Refresh Document List
          </Button>
        </div>
      </div>

      <Dialog
        open={isUploadModalOpen}
        onOpenChange={(o) => !isUploading && setIsUploadModalOpen(o)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload documents for this student. Supported formats: PDF, DOC,
              DOCX, TXT, JPG, JPEG, PNG.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-blue-400 ${
                isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center py-4">
                <div className="mb-3 bg-blue-100 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium mb-1">
                  Click to select files or drag and drop
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
                </p>
                <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Selected Files ({selectedFiles.length})
                </h3>

                {selectedFiles.map((fileData, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-sm truncate max-w-[200px]">
                          {fileData.file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        disabled={isUploading}
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      <div className="text-sm text-gray-700">
                        Title:{" "}
                        <span className="font-medium">{fileData.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1 text-gray-500">
                  Uploading {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              disabled={isUploading}
              className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Upload{" "}
                  {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
