// utils/uploadImage.js

export const uploadImage = async (file, setUploading, setUploadProgress, setImage, image) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET); // Replace with your Cloudinary upload preset
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    
    try {
      setUploading(true);
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}/image/upload`
      );
  
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setImage({ ...image, thumbnail: data.secure_url });
          setUploading(false);
          setUploadProgress(0); // Reset progress bar
        } else {
          console.error("Image upload failed: ", xhr.responseText);
          setUploading(false);
        }
      };
  
      xhr.onerror = () => {
        console.error("Image upload failed.");
        setUploading(false);
      };
  
      xhr.send(formData);
    } catch (error) {
      console.error("Image upload failed: ", error);
      setUploading(false);
    }
  };
  