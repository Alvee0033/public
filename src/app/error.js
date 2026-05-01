"use client";

import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
  const { back } = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {error?.message || "We're sorry, but an unexpected error occurred."}
        </p>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-red-700">Error details: {error?.digest}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button className="w-full" onClick={reset}>
            Try again
          </Button>
          <Button className="w-full" onClick={back}>
            <Undo /> Back
          </Button>
        </div>
      </div>
    </div>
  );
}
