import logo from "@/assets/icons/admin_logo.png";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <Image
          src={logo}
          alt="TutorsPlan Logo"
          width={80}
          height={80}
          priority
          className="rounded-lg animate-pulse"
          style={{ width: "80px", height: "80px" }}
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-full animate-pulse"></div>
      </div>
      {/* <p className="mt-4 text-gray-600">Loading...</p> */}
    </div>
  );
}
