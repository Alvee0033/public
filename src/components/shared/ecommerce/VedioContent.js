import React from "react";

const VedioContent = ({ product }) => {
  // Assume product.videoUrl contains the video link from backend
  if (!product?.videoUrl) return <div>No video available.</div>;
  return (
    <div className="aspect-[16/9]">
      <iframe
        src={product.videoUrl}
        allowFullScreen=""
        allow="autoplay"
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default VedioContent;
