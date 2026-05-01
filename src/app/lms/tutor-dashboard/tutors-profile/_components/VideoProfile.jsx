"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Video } from "lucide-react";
import { useRef, useState } from "react";
import { handleProfileMediaUpload } from "./ProfileMediaUpload";

export default function VideoProfile({ tutorId }) {
    const [showVideoTips, setShowVideoTips] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const fileInputRef = useRef(null);

    const handleVideoBtnClick = () => {
        if (!uploading) fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !tutorId) return;
        setUploading(true);
        try {
            const url = await handleProfileMediaUpload({ tutorId, file, type: "video" });
            setVideoUrl(url);
        } catch { }
        setUploading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Video className="w-5 h-5" />
                    Video Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative">
                    {videoUrl ? (
                        <video src={videoUrl} controls className="object-cover w-full h-full" />
                    ) : (
                        <>
                            <Play className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Upload Introduction Video</p>
                        </>
                    )}
                    <Button variant="outline" size="sm" onClick={handleVideoBtnClick} disabled={uploading}>
                        {uploading ? "Uploading..." : "Choose Video File"}
                    </Button>
                    <input
                        type="file"
                        accept="video/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                            <span className="text-xs text-gray-500">Uploading...</span>
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500">
                    <p>• Recommended: 2-3 minute introduction video</p>
                    <p>• Formats: MP4, MOV, AVI</p>
                    <p>• Max file size: 100MB</p>
                    <p>• Resolution: 720p or higher</p>
                </div>
                <div>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800" onClick={() => setShowVideoTips(!showVideoTips)}>
                        <span>•••</span>
                        <span>Video Tips</span>
                    </button>
                    {showVideoTips && (
                        <div className="bg-blue-50 p-4 rounded-lg mt-2">
                            <h4 className="font-medium text-blue-900 mb-2">Video Tips:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Introduce yourself and your background</li>
                                <li>• Explain your teaching style</li>
                                <li>• Show enthusiasm for your subjects</li>
                                <li>• Keep it professional and engaging</li>
                                <li>• Ensure good lighting and clear audio</li>
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
