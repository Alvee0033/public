import axios from "@/lib/axios";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

export async function handleProfileMediaUpload({ tutorId, file, type }) {
    try {
        // 1. Upload to Cloudinary
        const url = await uploadToCloudinary(file, type === "video" ? "video" : "image");
        if (!url) throw new Error("Upload failed");

        // 2. Patch tutor profile with correct fields
        const patchData = type === "video"
            ? { public_url: url }
            : { profile_picture: url };

        await axios.patch(`/tutors/${tutorId}`, patchData);

        toast.success(`${type === "video" ? "Video" : "Profile picture"} updated!`);
        return url;
    } catch (err) {
        toast.error(err.message || "Failed to update profile");
        throw err;
    }
}
