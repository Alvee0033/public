"use client";
import videoImage from "@/assets/images/icon/video.png";
import Image from "next/image";
import { useState } from "react";
import ReactPlayer from "react-player";
const PopupVideo = ({ videoUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="lvideo relative w-15 h-15 md:h-20 md:w-20 lg:w-15 lg:h-15 2xl:h-70px 2xl:w-70px 3xl:h-20 3xl:w-20 bg-secondaryColor rounded-full flex items-center justify-center"
      >
        <span className="animate-buble absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full"></span>
        <span className="animate-buble2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[180px] h-[180px] border-secondaryColor rounded-full"></span>
        <Image src={videoImage} alt="Play video" />
      </button>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 right-0 text-white hover:text-gray-300"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                playing={isModalOpen}
                controls
                playsinline
                pip
                stopOnUnmount={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                  },
                  vimeo: {
                    playerOptions: { title: true },
                  },
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupVideo;
