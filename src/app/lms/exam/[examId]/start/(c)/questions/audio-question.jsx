"use client";

import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Mic, PauseCircle, PlayCircle, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioQuestion({ question, answer = "", onAnswer }) {
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [responseType, setResponseType] = useState("text"); // text, upload, record
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const responseAudioRef = useRef(new Audio());
  const [isResponsePlaying, setIsResponsePlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [question]);

  // Add event listeners for response audio
  useEffect(() => {
    const audio = responseAudioRef.current;

    const handleEnded = () => setIsResponsePlaying(false);
    const handlePause = () => setIsResponsePlaying(false);
    const handlePlay = () => setIsResponsePlaying(true);
    const handleError = (e) => {
      console.error("Response audio error:", e);
      setError("Failed to play response audio");
      setIsResponsePlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  if (!question?.exam_question_details?.[0]) return null;
  const questionAudioUrl =
    question.exam_question_details[0].answer_video_audio_link;

  const handleAudioLoad = () => {
    setIsLoading(false);
  };

  const handleAudioError = (e) => {
    console.error("Audio error:", e);
    setError("Failed to load audio. Please try again.");
    setIsLoading(false);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback error:", err);
      setError("Failed to play audio. Please try again.");
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const audioUrl = await uploadToCloudinary(file, "audio", (progress) => {
        setUploadProgress(progress);
      });
      onAnswer({ type: "audio_upload", url: audioUrl });

      setUploadedUrl(audioUrl);
    } catch (err) {
      setError("Failed to upload audio. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Handle recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedBlob(blob);

        // Upload the recorded audio
        try {
          setIsLoading(true);
          const audioUrl = await uploadToCloudinary(
            blob,
            "audio",
            (progress) => {
              setUploadProgress(progress);
            }
          );
          onAnswer({ type: "audio_record", url: audioUrl });
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
        "Failed to start recording. Please check your microphone permissions."
      );
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const renderResponseAudioPlayer = (audioUrl) => {
    const toggleResponsePlay = async () => {
      try {
        if (isResponsePlaying) {
          responseAudioRef.current.pause();
        } else {
          responseAudioRef.current.src = audioUrl;
          await responseAudioRef.current.play();
        }
      } catch (err) {
        console.error("Failed to play response:", err);
        setError("Failed to play response audio");
        setIsResponsePlaying(false);
      }
    };

    // Extract filename from URL
    const getFileName = (url) => {
      const parts = url.split("/");
      const fullName = parts[parts.length - 1];
      // Remove any query parameters
      return fullName.split("?")[0];
    };

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleResponsePlay}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isResponsePlaying ? (
                <PauseCircle className="w-8 h-8 text-purple-600" />
              ) : (
                <PlayCircle className="w-8 h-8 text-purple-600" />
              )}
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {getFileName(audioUrl)}
              </span>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {responseAudioRef.current?.duration
                    ? `${Math.floor(responseAudioRef.current.duration)}s`
                    : "Loading..."}
                </div>
                <div className="h-1 w-32 bg-gray-200 rounded">
                  <div
                    className="h-full bg-purple-600 rounded transition-all"
                    style={{
                      width: `${
                        (responseAudioRef.current?.currentTime /
                          responseAudioRef.current?.duration) *
                          100 || 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <audio
              ref={responseAudioRef}
              src={audioUrl}
              preload="auto"
              onTimeUpdate={() =>
                setIsResponsePlaying(!responseAudioRef.current.paused)
              }
            />
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
        <div className="rounded-lg overflow-hidden bg-gray-50 p-6">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}

            {error && (
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <audio
              ref={audioRef}
              onLoadedData={handleAudioLoad}
              onError={handleAudioError}
              onEnded={() => setIsPlaying(false)}
              preload="auto"
            >
              <source src={questionAudioUrl} type="audio/mpeg" />
              <source src={questionAudioUrl} type="audio/wav" />
              <source src={questionAudioUrl} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading || error}
              >
                {isPlaying ? (
                  <PauseCircle className="w-12 h-12 text-purple-600" />
                ) : (
                  <PlayCircle className="w-12 h-12 text-purple-600" />
                )}
              </button>
            </div>
          </div>
        </div>

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
              Upload Audio
            </Button>
            <Button
              variant={responseType === "record" ? "default" : "outline"}
              onClick={() => setResponseType("record")}
            >
              Record Answer
            </Button>
          </div>

          {/* Show current response if exists */}
          {answer?.type === "audio_upload" &&
            renderResponseAudioPlayer(answer.url)}
          {answer?.type === "audio_record" &&
            renderResponseAudioPlayer(answer.url)}

          {/* Response type specific inputs */}
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

          {/* Only show upload/record UI if no response exists */}
          {responseType === "upload" && !answer?.url && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload audio or drag and drop
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

          {responseType === "record" && !answer?.url && (
            <div className="border rounded-lg p-6 text-center">
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
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              {isRecording && (
                <p className="mt-2 text-sm text-red-500">
                  Recording in progress...
                </p>
              )}
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
