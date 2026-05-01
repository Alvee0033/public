"use client";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BiCaptions } from "react-icons/bi";
import {
  FiMaximize,
  FiPause,
  FiPlay,
  FiSettings,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

const CourseVideoPlayer = ({ videoUrl = "", posterUrl, autoPlay = false }) => {
  // If no videoUrl, show not found
  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-full">
        <AlertCircle className="w-10 h-10 mb-2 text-red-700" />
        <span className="text-sm text-red-700">Video not published yet</span>
      </div>
    );
  }

  // Refs
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const settingsMenuRef = useRef(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [screenSize, setScreenSize] = useState("desktop"); // 'mobile','tablet','desktop'
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewX, setPreviewX] = useState(0);

  // Settings: playback speed menu (portal)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [settingsPos, setSettingsPos] = useState({
    top: 0,
    left: 0,
    width: 180,
  });

  // apply playback rate to video element when changed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // close settings when clicking outside (scoped to this player)
  useEffect(() => {
    if (!settingsOpen) return;
    const onDocClick = (e) => {
      if (settingsMenuRef.current && settingsMenuRef.current.contains(e.target))
        return;
      if (settingsBtnRef.current && settingsBtnRef.current.contains(e.target))
        return;
      setSettingsOpen(false);
    };
    const onCloseOnScroll = () => setSettingsOpen(false);
    document.addEventListener("click", onDocClick);
    window.addEventListener("resize", onCloseOnScroll);
    window.addEventListener("scroll", onCloseOnScroll, true);
    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("resize", onCloseOnScroll);
      window.removeEventListener("scroll", onCloseOnScroll, true);
    };
  }, [settingsOpen]);

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    setSettingsOpen(false);
  };

  // compute menu position when opened
  useEffect(() => {
    if (!settingsOpen || !settingsBtnRef.current) return;
    const btnRect = settingsBtnRef.current.getBoundingClientRect();
    const menuWidth = settingsPos.width || 180;
    let left = btnRect.right - menuWidth;
    // avoid overflow right
    const maxRight = window.innerWidth - 8;
    if (left + menuWidth > maxRight) left = Math.max(8, maxRight - menuWidth);
    // avoid left overflow
    left = Math.max(8, left);
    const top = Math.min(window.innerHeight - 8 - 200, btnRect.bottom + 8); // clamp
    setSettingsPos({ top, left, width: menuWidth });
  }, [settingsOpen, settingsBtnRef, settingsPos.width]);

  // Screen size detection
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 640) setScreenSize("mobile");
      else if (w < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };
    check();
    const onResize = () => {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(check, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Auto-hide controls (desktop/tablet)
  useEffect(() => {
    if (screenSize === "mobile") return;
    clearTimeout(controlsTimeoutRef.current);
    if (isControlsVisible && isPlaying) {
      controlsTimeoutRef.current = setTimeout(
        () => setIsControlsVisible(false),
        3000
      );
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [isControlsVisible, isPlaying, screenSize]);

  // Format time
  const formatTime = (t = 0) => {
    if (!isFinite(t) || t <= 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Controls
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
    setIsControlsVisible(true);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const muted = !isMuted;
    v.muted = muted;
    setIsMuted(muted);
    if (muted) {
      setVolume(0);
    } else if (v.volume === 0) {
      v.volume = 1;
      setVolume(1);
    }
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      videoRef.current.currentTime - 10,
      0
    );
  };
  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      videoRef.current.currentTime + 10,
      videoRef.current.duration || Infinity
    );
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    videoRef.current.currentTime = pos * (duration || 0);
  };

  const toggleFullScreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement)
        await containerRef.current.requestFullscreen();
      else if (document.exitFullscreen) await document.exitFullscreen();
      setIsFullScreen(Boolean(document.fullscreenElement));
    } catch (err) {
      console.error("Fullscreen error", err);
    }
  };

  const toggleCaptions = () => setShowCaptions((s) => !s);

  const showControls = () => {
    setIsControlsVisible(true);
    clearTimeout(controlsTimeoutRef.current);
    if (screenSize !== "mobile" && isPlaying) {
      controlsTimeoutRef.current = setTimeout(
        () => setIsControlsVisible(false),
        3000
      );
    }
  };

  // Named handlers to allow proper removal
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentTime(v.currentTime || 0);
    const onDuration = () => setDuration(v.duration || 0);
    const onProgress = () => {
      if (v.buffered && v.buffered.length)
        setBuffered(v.buffered.end(v.buffered.length - 1) || 0);
    };
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("durationchange", onDuration);
    v.addEventListener("progress", onProgress);
    v.addEventListener("ended", onEnded);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", onPlaying);
    v.addEventListener("canplaythrough", onPlaying);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("durationchange", onDuration);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", onPlaying);
      v.removeEventListener("canplaythrough", onPlaying);
    };
  }, [videoRef]);

  useEffect(() => {
    // Keep video volume in sync with state when changed programmatically
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Preview tooltip (desktop/tablet only)
  const handleProgressMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    if (screenSize === "mobile") return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setPreviewTime(pos * duration);
    setPreviewX(e.clientX - rect.left);
    setShowPreview(true);
  };

  // Safety percent helpers
  const playedPercent = duration ? currentTime / duration : 0;
  const bufferedPercent = duration ? buffered / duration : 0;

  // Simple volume change handler
  const onVolumeChange = (val) => {
    const v = Math.min(Math.max(Number(val), 0), 1);
    setVolume(v);
    setIsMuted(v === 0);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative group bg-black w-full max-w-full rounded-lg overflow-hidden shadow-lg mt-6"
      style={{
        aspectRatio: "16/9",
        maxHeight:
          screenSize === "mobile"
            ? "56vh"
            : screenSize === "tablet"
            ? "68vh"
            : "80vh",
      }}
      onMouseMove={showControls}
      onTouchStart={showControls}
      onClick={showControls}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={videoUrl}
        poster={posterUrl}
        autoPlay={autoPlay}
        playsInline
        preload="auto"
        controlsList="nodownload"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration || 0);
        }}
        onError={() => setVideoError(true)}
      />

      {/* Error */}
      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-4 text-center">
          <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
          <span className="text-sm text-white">
            Video failed to load. Please check the video URL or try again later.
          </span>
        </div>
      )}

      {/* Buffering */}
      {isBuffering && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white"></div>
          <span className="ml-3 text-white text-sm">Buffering…</span>
        </div>
      )}

      {/* Controls group */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
          isControlsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {/* Progress bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          onMouseMove={handleProgressMove}
          onMouseLeave={() => setShowPreview(false)}
          className="relative cursor-pointer w-full"
          style={{
            height: screenSize === "mobile" ? 10 : 14,
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-full" />
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full"
            style={{
              width: `${bufferedPercent * 100}%`,
              background: "rgba(255,255,255,0.18)",
            }}
          />
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full"
            style={{
              width: `${playedPercent * 100}%`,
              background: "linear-gradient(90deg,#2C60EB,#4F7DFF)",
            }}
          />
          {/* Thumb */}
          <div
            style={{ left: `calc(${playedPercent * 100}% - 8px)` }}
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow"
          />
          {/* Preview tooltip (desktop only) */}
          {showPreview && screenSize !== "mobile" && (
            <div
              className="absolute z-30 px-2 py-1 bg-black/80 text-white text-xs rounded"
              style={{
                left: previewX,
                top: -32,
                transform: "translateX(-50%)",
              }}
            >
              {formatTime(previewTime)}
            </div>
          )}
        </div>

        {/* Controls bottom bar */}
        <div className="backdrop-blur-md bg-black/60 border-t border-white/10 px-3 sm:px-4 py-3 rounded-b-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={skipBackward}
              className="text-white p-2 rounded-full hover:bg-white/10"
            >
              <FiSkipBack className="text-lg" />
            </button>
            <button
              onClick={togglePlay}
              disabled={isBuffering || videoError}
              className={`text-white p-3 rounded-full hover:bg-white/10 ${
                isBuffering || videoError ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPlaying ? (
                <FiPause className="text-2xl" />
              ) : (
                <FiPlay className="text-2xl" />
              )}
            </button>
            <button
              onClick={skipForward}
              className="text-white p-2 rounded-full hover:bg-white/10"
            >
              <FiSkipForward className="text-lg" />
            </button>
            <div className="text-white text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white p-2 rounded-full hover:bg-white/10"
            >
              {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            {/* simple volume slider (visible on non-mobile) */}
            {screenSize !== "mobile" && (
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(e.target.value)}
                className="w-20"
              />
            )}

            <button
              onClick={toggleCaptions}
              className="text-white p-2 rounded-full hidden md:block"
            >
              <BiCaptions color={showCaptions ? "#2C60EB" : "white"} />
            </button>
            {/* Settings button + menu */}
            <div>
              <button
                ref={settingsBtnRef}
                data-settings-btn
                onClick={() => setSettingsOpen((s) => !s)}
                className="text-white p-2 rounded-full hidden lg:block"
                title={`Settings (speed ${playbackRate}x)`}
              >
                <FiSettings />
              </button>
              {settingsOpen &&
                createPortal(
                  <div
                    ref={settingsMenuRef}
                    className="bg-white text-black rounded shadow-lg z-[9999] overflow-hidden"
                    style={{
                      position: "fixed",
                      top: settingsPos.top,
                      left: settingsPos.left,
                      width: settingsPos.width,
                    }}
                    role="menu"
                    aria-label="Player settings"
                  >
                    <div className="px-3 py-2 text-xs font-medium border-b">
                      Playback speed
                    </div>
                    <div className="flex flex-col">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                        <button
                          key={r}
                          onClick={() => changePlaybackRate(r)}
                          className={`px-3 py-2 text-sm text-left hover:bg-gray-100 ${
                            playbackRate === r ? "font-semibold" : ""
                          }`}
                        >
                          {r}x
                        </button>
                      ))}
                    </div>
                  </div>,
                  document.body
                )}
            </div>
            <button
              onClick={toggleFullScreen}
              className="text-white p-2 rounded-full"
            >
              <FiMaximize />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay big play button for easier touch */}
      {screenSize === "mobile" && !isControlsVisible && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <div className="bg-black/50 rounded-full p-3">
            {isPlaying ? (
              <FiPause className="text-white text-2xl" />
            ) : (
              <FiPlay className="text-white text-2xl" />
            )}
          </div>
        </button>
      )}

      {/* Loading indicator when duration unknown */}
      {duration === 0 && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}
    </div>
  );
};

export default CourseVideoPlayer;
