"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios";
import { toast } from "sonner";
import { Camera, CheckCircle2, ShieldCheck, Video, XCircle } from "lucide-react";

const DOCUMENT_TYPES = [
  { id: "business_license", label: "Business License", description: "Official registration certificate", required: true },
  { id: "operator_id", label: "Operator ID / Passport", description: "Government-issued photo ID used for facial match", required: true },
  { id: "tax_certificate", label: "Tax Certificate", description: "VAT or tax registration document", required: false },
];

const MEDIAPIPE_VERSION = "0.10.34";
const MEDIAPIPE_WASM_ROOTS = [
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`,
  `https://unpkg.com/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`,
];
const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

function DocumentUploadRow({ hubId, doc, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async () => {
    if (!file || !hubId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await instance.post(
        `/learning-hub/${hubId}/documents?document_type=${doc.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploaded(true);
      toast.success(`${doc.label} uploaded successfully.`);
      onUploaded(doc.id);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ?? `Failed to upload ${doc.label}.`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-colors ${uploaded ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {uploaded ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 rounded-full px-2 py-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Uploaded
              </span>
            ) : doc.required ? (
              <span className="text-xs text-red-600 bg-red-50 rounded-full px-2 py-0.5">Required</span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">Optional</span>
            )}
            <span className="text-sm font-medium text-gray-800">{doc.label}</span>
          </div>
          <p className="text-xs text-gray-500">{doc.description}</p>
        </div>

        {!uploaded && (
          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <span className="text-xs text-blue-600 hover:underline font-medium">
                {file ? file.name.slice(0, 20) + (file.name.length > 20 ? "…" : "") : "Choose file"}
              </span>
            </label>
            {file && (
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
              >
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FacialIdentityVerification({ disabled, onVerified }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState("");
  const [modelLoading, setModelLoading] = useState(false);
  const [faceStatus, setFaceStatus] = useState("Camera not started");
  const [detectedPose, setDetectedPose] = useState("none");
  const [yawDegrees, setYawDegrees] = useState(0);
  const [challengeStep, setChallengeStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const challengeStepRef = useRef(0);
  const completedStepsRef = useRef([]);
  const poseHoldRef = useRef({ pose: "none", since: 0 });
  const firstSidePoseRef = useRef(null);

  const challengeSteps = [
    { id: "center_start", label: "Look straight at the camera", pose: "center", hint: "Keep your face inside the oval" },
    { id: "turn_left", label: "Turn your head left", pose: "side", sideMode: "first", hint: "Slowly turn to one side and hold" },
    { id: "turn_right", label: "Turn your head right", pose: "side", sideMode: "opposite", hint: "Turn to the opposite side and hold" },
    { id: "center_end", label: "Face forward again", pose: "center", hint: "Return to the center" },
  ];
  const livenessComplete = completedSteps.length === challengeSteps.length;
  const progressPercent = Math.round((completedSteps.length / challengeSteps.length) * 100);
  const requiredHoldMs = 450;

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks?.().forEach((track) => track.stop());
      landmarkerRef.current?.close?.();
    };
  }, []);

  const loadFaceLandmarker = async () => {
    if (landmarkerRef.current) return landmarkerRef.current;

    setModelLoading(true);
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    let lastError;

    for (const wasmRoot of MEDIAPIPE_WASM_ROOTS) {
      try {
        const vision = await FilesetResolver.forVisionTasks(wasmRoot);
        for (const delegate of ["GPU", "CPU"]) {
          try {
            const landmarker = await FaceLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: FACE_LANDMARKER_MODEL_URL,
                delegate,
              },
              runningMode: "VIDEO",
              numFaces: 1,
              outputFacialTransformationMatrixes: true,
            });
            landmarkerRef.current = landmarker;
            setModelLoading(false);
            return landmarker;
          } catch (err) {
            lastError = err;
          }
        }
      } catch (err) {
        lastError = err;
      }
    }

    setModelLoading(false);
    throw lastError ?? new Error("MediaPipe face tracker could not be initialized.");
  };

  const getYawFromMatrix = (matrix) => {
    const values = matrix?.data ?? matrix?.matrix ?? matrix;
    if (!values || values.length < 16) return null;
    const yaw = Math.atan2(Number(values[8]), Number(values[10])) * (180 / Math.PI);
    return Number.isFinite(yaw) ? yaw : null;
  };

  const getLandmarkYawProxy = (landmarks) => {
    const leftEye = landmarks?.[33];
    const rightEye = landmarks?.[263];
    const nose = landmarks?.[1];
    const chin = landmarks?.[152];
    const forehead = landmarks?.[10];
    if (!leftEye || !rightEye || !nose || !chin || !forehead) return null;

    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    const faceHeight = Math.abs(chin.y - forehead.y);
    if (eyeDistance < 0.06 || faceHeight < 0.12) return null;

    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const normalizedNoseOffset = (nose.x - eyeCenterX) / eyeDistance;
    return normalizedNoseOffset * 38;
  };

  const getPoseFromYaw = (yaw) => {
    if (yaw == null) return "none";
    const absYaw = Math.abs(yaw);
    if (absYaw <= 8) return "center";
    if (yaw >= 9) return "left";
    if (yaw <= -9) return "right";
    return "transition";
  };

  const getPoseFromResult = (result) => {
    const matrixYaw = getYawFromMatrix(result.facialTransformationMatrixes?.[0]);
    const landmarkYaw = getLandmarkYawProxy(result.faceLandmarks?.[0]);
    const yaw = matrixYaw ?? landmarkYaw;
    return { pose: getPoseFromYaw(yaw), yaw: Number(yaw ?? 0) };
  };

  const hasHeldPose = (pose, now) => {
    if (pose !== poseHoldRef.current.pose) {
      poseHoldRef.current = { pose, since: now };
      return false;
    }
    return now - poseHoldRef.current.since >= requiredHoldMs;
  };

  const oppositePose = (pose) => {
    if (pose === "left") return "right";
    if (pose === "right") return "left";
    return null;
  };

  const stepMatchesPose = (actualPose, step) => {
    if (!step) return false;
    if (step.pose === "center") return actualPose === "center";
    if (step.pose !== "side") return actualPose === step.pose;
    if (actualPose !== "left" && actualPose !== "right") return false;

    if (step.sideMode === "first") {
      if (!firstSidePoseRef.current) firstSidePoseRef.current = actualPose;
      return actualPose === firstSidePoseRef.current;
    }

    if (step.sideMode === "opposite") {
      return Boolean(firstSidePoseRef.current) && actualPose === oppositePose(firstSidePoseRef.current);
    }

    return false;
  };

  const poseLabel = (pose) => {
    if (pose === "left") return "turned left";
    if (pose === "right") return "turned right";
    if (pose === "center") return "centered";
    if (pose === "transition") return "moving";
    return "center";
  };

  const runFaceTracking = () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runFaceTracking);
      return;
    }

    const now = performance.now();
    const result = landmarker.detectForVideo(video, now);
    const faceCount = result.faceLandmarks?.length ?? 0;

    if (faceCount !== 1) {
      setDetectedPose("none");
      setFaceStatus(faceCount > 1 ? "Only one face can be in frame" : "No face detected");
      poseHoldRef.current = { pose: "none", since: now };
      rafRef.current = requestAnimationFrame(runFaceTracking);
      return;
    }

    const { pose, yaw } = getPoseFromResult(result);
    setDetectedPose(pose);
    setYawDegrees(Math.round(yaw));
    setFaceStatus(pose === "transition" ? "Keep turning slowly" : "Face tracked");

    const current = challengeSteps[challengeStepRef.current];
    const poseReady = pose !== "transition" && pose !== "none" && hasHeldPose(pose, now);
    if (current && poseReady && stepMatchesPose(pose, current)) {
      const alreadyCompleted = completedStepsRef.current.includes(current.id);
      if (!alreadyCompleted) {
        const nextCompleted = [...completedStepsRef.current, current.id];
        const nextStep = Math.min(challengeStepRef.current + 1, challengeSteps.length);
        completedStepsRef.current = nextCompleted;
        challengeStepRef.current = nextStep;
        setCompletedSteps(nextCompleted);
        setChallengeStep(nextStep);
      }
    }

    rafRef.current = requestAnimationFrame(runFaceTracking);
  };

  const startCamera = async () => {
    if (disabled) return;
    setCameraError("");
    setCapturedImage("");
    completedStepsRef.current = [];
    challengeStepRef.current = 0;
    setCompletedSteps([]);
    setChallengeStep(0);
    onVerified(null);
    try {
      await loadFaceLandmarker();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      setFaceStatus("Move into frame");
      rafRef.current = requestAnimationFrame(runFaceTracking);
    } catch (err) {
      setModelLoading(false);
      const message = err?.message ? ` (${err.message})` : "";
      setCameraError(
        err?.name === "NotAllowedError" || err?.message?.includes("Permission")
          ? "Camera permission is required for live facial identity verification."
          : `Unable to start face tracking. Check network access for MediaPipe assets and try again.${message}`,
      );
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || !livenessComplete) {
      toast.error("Complete the left/right liveness challenge before capture.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg", 0.86);
    setCapturedImage(image);
    onVerified({
      status: "captured",
      captured_at: new Date().toISOString(),
      checks: [
        "MediaPipe face tracking completed",
        "Head movement challenge completed: center, left, right, center",
        "Face must match uploaded government ID during provider review",
        "Photo, screen replay, mask, or deepfake attempts must be rejected",
      ],
    });
    toast.success("Live facial identity frame captured.");

    streamRef.current?.getTracks?.().forEach((track) => track.stop());
    streamRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setCameraActive(false);
  };

  const resetCapture = () => {
    setCapturedImage("");
    completedStepsRef.current = [];
    challengeStepRef.current = 0;
    setCompletedSteps([]);
    setChallengeStep(0);
    setDetectedPose("none");
    setYawDegrees(0);
    setFaceStatus("Camera not started");
    poseHoldRef.current = { pose: "none", since: 0 };
    firstSidePoseRef.current = null;
    onVerified(null);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks?.().forEach((track) => track.stop());
    streamRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setCameraActive(false);
    setDetectedPose("none");
    setYawDegrees(0);
    setFaceStatus("Camera stopped");
    poseHoldRef.current = { pose: "none", since: 0 };
    firstSidePoseRef.current = null;
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sky-700 shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-900">Live facial identity verification</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                The operator must pass guided face tracking before capture. Follow the instructions:
                look forward, turn left, turn right, then face forward again. The final provider review
                should still validate face match, document authenticity, and anti-spoofing.
              </p>
            </div>
            {capturedImage ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Captured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <Video className="h-3.5 w-3.5" />
                Required
              </span>
            )}
          </div>

          <div className="mt-5 flex justify-center">
            <div className="w-full max-w-[360px] rounded-2xl border border-sky-100 bg-white p-3 shadow-sm">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-950">
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured live facial identity frame" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-6 rounded-[45%] border-2 border-white/90 shadow-[0_0_0_999px_rgba(15,23,42,0.26)]" />
                    <div className="pointer-events-none absolute inset-x-12 top-1/2 h-px bg-white/20" />
                    <div className="pointer-events-none absolute inset-y-12 left-1/2 w-px bg-white/20" />
                    <div className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {faceStatus} {detectedPose !== "none" ? `- ${poseLabel(detectedPose)} (${yawDegrees}°)` : ""}
                    </div>
                    {cameraActive && !livenessComplete && (
                      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/92 p-3 text-center shadow-lg backdrop-blur">
                        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Current instruction</p>
                        <p className="mt-1 text-sm font-black text-slate-950">
                          {challengeSteps[challengeStep]?.label ?? "Complete"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {challengeSteps[challengeStep]?.hint}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Liveness progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {cameraError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="mt-4 grid gap-2 text-xs text-slate-700 sm:grid-cols-4">
            {challengeSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex min-h-[54px] items-center gap-2 rounded-xl px-3 py-2 ${
                  completedSteps.includes(step.id)
                    ? "bg-green-100 text-green-800"
                    : index === challengeStep
                      ? "bg-white text-sky-800 ring-2 ring-sky-200"
                      : "bg-white/80 text-slate-500"
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    completedSteps.includes(step.id) ? "text-green-600" : "text-slate-300"
                  }`}
                />
                <span>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {!cameraActive && !capturedImage && (
              <Button
                type="button"
                onClick={startCamera}
                disabled={disabled || modelLoading}
                className="bg-sky-700 text-white hover:bg-sky-800"
              >
                <Camera className="mr-2 h-4 w-4" />
                {modelLoading ? "Loading face tracker..." : "Start live liveness check"}
              </Button>
            )}
            {cameraActive && (
              <>
                <Button
                  type="button"
                  onClick={captureFrame}
                  disabled={!livenessComplete}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Capture verified selfie
                </Button>
                <Button type="button" variant="outline" onClick={stopCamera}>
                  Stop camera
                </Button>
              </>
            )}
            {capturedImage && (
              <Button type="button" variant="outline" onClick={resetCapture}>
                Retake
              </Button>
            )}
          </div>

          {disabled && (
            <p className="mt-3 text-xs font-medium text-amber-700">
              Upload the required business license and operator ID before starting facial identity verification.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StepHubDocuments({ hubId, onComplete, onBack }) {
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [facialIdentity, setFacialIdentity] = useState(null);
  const requiredUploaded = DOCUMENT_TYPES.filter((doc) => doc.required).every((doc) =>
    uploadedDocs.includes(doc.id),
  );
  const canSubmit = Boolean(hubId && requiredUploaded && facialIdentity);

  const handleDocUploaded = (docId) => {
    setUploadedDocs((prev) => (prev.includes(docId) ? prev : [...prev, docId]));
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("Upload required documents and complete live facial identity verification first.");
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">Verification is required before submission.</p>
        <p>Upload the business license and operator ID, then complete the live facial identity check for admin/provider review.</p>
      </div>

      <div className="space-y-3">
        {DOCUMENT_TYPES.map((doc) => (
          <DocumentUploadRow
            key={doc.id}
            hubId={hubId}
            doc={doc}
            onUploaded={handleDocUploaded}
          />
        ))}
      </div>

      <FacialIdentityVerification
        disabled={false}
        onVerified={setFacialIdentity}
      />

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-8"
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          Submit Hub Registration ✓
        </Button>
      </div>
    </div>
  );
}
