import { instance } from "@/lib/axios";

export async function uploadToCloudinary(
  file,
  resourceType = "auto",
  onProgress
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", resourceType);

  try {
    const response = await instance.post("/file-cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    if (response.data?.status === "SUCCESS") {
      return response.data.data.data.url;
    }
    throw new Error(response.data?.message || "Upload failed");
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
}
