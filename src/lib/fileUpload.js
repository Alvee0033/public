import axios from "@/lib/axios";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

// Function to upload any file type (no restrictions)
export async function fileUploadAny(file) {
  try {
    if (!file) {
      toast.error("No file selected");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);


    // Get the authentication token from the session
    const session = await getSession();
    let token = session?.user?.token || '';

    // Fallback to localStorage if session token is not available
    if (!token) {
      token = localStorage.getItem('token') || '';
    }

 
    // Check if token is available
    if (!token) {
      console.error('No authentication token available');
      throw new Error('You must be logged in to upload files. Please log in and try again.');
    }


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file-cloudinary/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do not set Content-Type header - let the browser set it with the boundary
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with status:', response.status, errorText);

      // Parse error response if it's JSON
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Not JSON, use as is
      }

      // Handle specific error cases
      if (response.status === 401) {
        // If unauthorized, suggest logging in again
        toast.error('Your session has expired. Please log in again.');
        throw new Error(`Upload failed: Unauthorized. Please log in again.`);
      } else if (errorData?.message?.includes('Unsupported codec')) {
        // Handle codec issues
        toast.error('This audio file format is not supported. Please try a different file or convert it to MP3.');
        throw new Error(`Unsupported audio format: ${errorData.message}`);
      } else {
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
    }

    const data = await response.json();

    // Add debug log for response

    if (data?.status === "SUCCESS" && data?.data?.data?.url) {
      toast.success("File uploaded successfully!");
      return data.data.data.url;
    } else {
      console.error("Upload response format error:", data);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Upload error:", {
      message: error.message,
    });

    toast.error(error.message || "Failed to upload file");

    throw error; // Re-throw to handle in component
  }
}

// Original function with media type restrictions
// Helper function to retry upload with corrected extension
async function retryUploadWithCorrectExtension(file, originalError) {

  // Create a new file name with the correct extension
  let newFileName;
  let newFileType;

  if (originalError.includes('Unsupported codec aac for format mp3')) {
    // For AAC codec in MP3 files, change to .m4a
    newFileName = file.name.replace(/\.mp3$/i, '.m4a');
    newFileType = 'audio/mp4';
  } else {
    // For other codec mismatches, we might need different handling
    throw new Error(originalError);
  }

  // Create a new File object with the same content but different name and type
  const newFile = new File([file], newFileName, { type: newFileType });


  // Try uploading with the new file - but use a direct upload approach to avoid recursion
  try {
    toast.info(`Retrying upload with corrected format: ${newFileName}`);

    // Get the authentication token
    const session = await getSession();
    let token = session?.user?.token || localStorage.getItem('token') || '';

    if (!token) {
      throw new Error('No authentication token available');
    }

    // Create form data with the new file
    const formData = new FormData();
    formData.append("file", newFile);

    // Make the request directly instead of calling fileUpload again to avoid potential infinite recursion
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file-cloudinary/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retry upload failed with status:', response.status, errorText);
      throw new Error(`Retry upload failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (data?.status === "SUCCESS" && data?.data?.data?.url) {
      toast.success("File uploaded successfully with corrected format!");
      return data.data.data.url;
    } else {
      console.error("Retry upload response format error:", data);
      throw new Error("Invalid response format from retry upload");
    }
  } catch (retryError) {
    console.error('Retry upload failed:', retryError);
    throw retryError;
  }
}

export async function fileUpload(file) {
  try {
    if (!file) {
      toast.error("No file selected");
      return null;
    }

    // Validate file type
    // Check if file type starts with image/, video/ or audio/
    const isAllowedType =
      file?.type?.startsWith("image/") ||
      file?.type?.startsWith("video/") ||
      file?.type?.startsWith("audio/") ||
      file?.type?.startsWith("application/pdf");

    if (!isAllowedType) {
      toast.error("Only image, audio and pdf files are supported");
      return null;
    }

    // Additional validation for audio files
    if (file?.type?.startsWith("audio/")) {
      // Get file extension
      const extension = file.name.split('.').pop().toLowerCase();

      // Check for problematic combinations
      const hasMP3Extension = extension === 'mp3';
      const isAAC = file.type.includes('aac');
      const isM4A = extension === 'm4a';

   
      // We'll handle codec issues in the error handling after the upload attempt

      // Reject any AAC files with MP3 extension
      if (hasMP3Extension && isAAC) {
        toast.error(`Cannot upload ${file.name}: AAC files with MP3 extension are not supported`);
        return null;
      }

      // Reject any file with MP3 extension that isn't explicitly audio/mpeg
      if (hasMP3Extension && file.type !== 'audio/mpeg') {
        toast.error(`Cannot upload ${file.name}: File has MP3 extension but is not a valid MP3 file`);
        return null;
      }

      // Reject M4A files (common source of codec issues)
      if (isM4A) {
        toast.error(`Cannot upload ${file.name}: M4A files are not supported`);
        return null;
      }

      // We've removed the size-based detection as it might block valid files
    }

    const formData = new FormData();
    formData.append("file", file);


    // Use axios instance which has authentication interceptor
    const response = await axios.post("/file-cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    if (response.data?.status === "SUCCESS" && response.data?.data?.data?.url) {
      toast.success("File uploaded successfully!");
      return response.data.data.data.url;
    } else {
      console.error("Upload response format error:", response.data);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Upload error:", {
      message: error.message,
      response: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      throw new Error('Authentication failed. Please log in again.');
    } else {
      toast.error(error.response?.data?.message || error.message || "Failed to upload file");
    }

    throw error; // Re-throw to handle in component
  }
}
