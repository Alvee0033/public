'use client'

import logo from "@/assets/icons/admin_logo.png";
import { Button } from "@/components/ui/button"; // Make sure to import Button
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router

export default function NotFound() {
  const router = useRouter();  // Initialize router from next/navigation

  const goBack = () => {
    router.back();  // Go back to the previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src={logo} alt="Admin Logo" width={80} height={80} className="drop-shadow-lg" />
        </div>

        {/* 404 Text with Gradient */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Oops! Page Not Found</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. Don't worry, it happens to the
            best of us!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">

          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>


          <Button
            variant="outline"
            size="lg"
            className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-8"
            onClick={goBack}  // Use the goBack function on click
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-15 blur-lg"></div>
      </div>
    </div>
  );
}
