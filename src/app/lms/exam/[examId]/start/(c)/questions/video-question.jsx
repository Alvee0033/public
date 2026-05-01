"use client";

import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Camera, PauseCircle, PlayCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function VideoQuestion({ question, answer = "", onAnswer }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [responseType, setResponseType] = useState("text");
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!question?.exam_question_details?.[0]) return null;
  const videoUrl = question.exam_question_details[0].answer_video_audio_link;

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const videoUrl = await uploadToCloudinary(file, "video", (progress) => {
        setUploadProgress(progress);
      });
      onAnswer({ type: "video_upload", url: videoUrl });
    } catch (err) {
      setError("Failed to upload video. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Handle recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);

        try {
          setIsLoading(true);
          const videoUrl = await uploadToCloudinary(
            blob,
            "video",
            (progress) => {
              setUploadProgress(progress);
            }
          );
          onAnswer({ type: "video_record", url: videoUrl });
        } catch (err) {
          setError("Failed to upload recording. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
          setUploadProgress(0);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(
        "Failed to start recording. Please check your camera permissions."
      );
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    setError("Failed to load video. Please try again.");
    setIsLoading(false);
  };

  const renderVideoPlayer = (videoUrl) => {
    const togglePlay = async () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    // Extract filename from URL
    const getFileName = (url) => {
      const parts = url.split("/");
      const fullName = parts[parts.length - 1];
      return fullName.split("?")[0];
    };

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-48 h-32 bg-black rounded overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                {isPlaying ? (
                  <PauseCircle className="w-12 h-12 text-white" />
                ) : (
                  <PlayCircle className="w-12 h-12 text-white" />
                )}
              </button>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {getFileName(videoUrl)}
              </span>
              <span className="text-xs text-gray-500">
                {videoRef.current?.duration
                  ? `${Math.floor(videoRef.current.duration)}s`
                  : "Loading..."}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAnswer("")}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="space-y-4">
        {/* Question Video Player */}
        <div className="rounded-lg overflow-hidden bg-gray-50 p-6">
          <div className="relative aspect-video">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <video
              className="w-full h-full rounded-lg"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              controls
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Response Options */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={responseType === "text" ? "default" : "outline"}
              onClick={() => setResponseType("text")}
            >
              Write Answer
            </Button>
            <Button
              variant={responseType === "upload" ? "default" : "outline"}
              onClick={() => setResponseType("upload")}
            >
              Upload Video
            </Button>
            <Button
              variant={responseType === "record" ? "default" : "outline"}
              onClick={() => setResponseType("record")}
            >
              Record Video
            </Button>
          </div>

          {/* Show current response if exists */}
          {(answer?.type === "video_upload" ||
            answer?.type === "video_record") &&
            renderVideoPlayer(answer.url)}

          {/* Text Response */}
          {responseType === "text" && (
            <textarea
              value={answer?.type === "text" ? answer.content : ""}
              onChange={(e) =>
                onAnswer({ type: "text", content: e.target.value })
              }
              placeholder="Write your answer here..."
              className="w-full p-3 min-h-[100px] border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          )}

          {/* Upload Response */}
          {responseType === "upload" && !answer?.url && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload video or drag and drop
                </span>
              </label>
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Record Response */}
          {responseType === "record" && !answer?.url && (
            <div className="border rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                {isRecording && (
                  <div className="relative w-full max-w-md aspect-video bg-black rounded overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`${
                    isRecording ? "bg-red-500 hover:bg-red-600" : ""
                  }`}
                >
                  {isRecording ? (
                    <>
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                {isRecording && (
                  <p className="text-sm text-red-500">
                    Recording in progress...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>
    </div>
  );
}
