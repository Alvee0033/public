import CustomImage from "@/components/core/CustomImage";
import { Card } from "@/components/ui/card";
import axios from "@/lib/axios";
import { Facebook, Linkedin, UserX } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstructorTab({ course, instructor: instructorProp }) {
  const primaryTutorId = course?.primary_tutor_id;
  const [instructor, setInstructor] = useState(instructorProp || null);
  const [loading, setLoading] = useState(!instructorProp && !!primaryTutorId);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If instructor was provided via props (prefetched), skip local fetch
    if (instructorProp) {
      setInstructor(instructorProp);
      setLoading(false);
      return;
    }

    if (!primaryTutorId) {
      setInstructor(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get(`/tutors/${primaryTutorId}`)
      .then((res) => {
        setInstructor(res?.data?.data || null);
      })
      .catch(() => {
        setInstructor(null);
        setError("Failed to load instructor");
      })
      .finally(() => setLoading(false));
  }, [primaryTutorId, instructorProp]);

  return (
    <div>
      <Card className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <UserX className="w-10 h-10 mb-2 animate-pulse" />
            <span className="text-lg font-medium">Loading instructor...</span>
          </div>
        ) : instructor ? (
          <div className="flex items-start gap-6">
            {instructor.profile_picture && (
              <CustomImage
                src={instructor?.profile_picture}
                alt={instructor.name}
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">{instructor.name}</h3>
              <p className="text-gray-600 mb-4">{instructor.job_title}</p>
              <p className="text-gray-700">{instructor.summary}</p>
              <div className="mt-4 flex items-center gap-4">
                {instructor.facebook && (
                  <a
                    href={instructor.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {instructor.linked_in && (
                  <a
                    href={instructor.linked_in}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <UserX className="w-10 h-10 mb-2 text-gray-300" />
            <span className="text-lg font-medium">
              {error ? "No instructor found" : "No instructor found"}
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
