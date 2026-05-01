import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Star,
  Users,
  BookOpen,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function TopInstitutesSection() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to generate initials from institute name
  const getInitials = (name) => {
    if (!name) return "?";

    const words = name.split(" ");
    if (words.length === 1) {
      // For single word, return first two letters (or just one if it's a single letter)
      return name.substring(0, 2).toUpperCase();
    } else {
      // For multiple words, return first letter of first two words
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  };

  useEffect(() => {
    async function fetchInstitutes() {
      try {
        setLoading(true);
        const res = await axios.get("/learning-hub", {
          params: { limit: 12, page: 1 },
        });

        const rawData = res?.data?.data;
        const hubs = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.items)
            ? rawData.items
            : [];

        const normalized = hubs.map((hub) => ({
          id: hub.id,
          name: hub.hub_name || hub.name || "Learning Hub",
          logo: hub.logo || hub.logo_url || "",
          city: hub.city || "",
          state: { name: hub.master_state?.name || hub.state_code || "" },
          country: { name: hub.master_country?.name || hub.country_code || "" },
          address: hub.address_line1 || "",
          master_institute_type: { name: hub.hub_class_label || "Learning Hub" },
          verified: hub.status === "active",
          rating_score: Number(hub.avg_rating || 0) * 20,
          course_count: Array.isArray(hub.services_offered)
            ? hub.services_offered.length
            : 0,
          student_count: 0,
        }));

        setInstitutes(normalized.slice(0, 6));
      } catch (err) {
        console.error("Error fetching learning hubs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInstitutes();
  }, []);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-4">
              Top Learning Institutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partner with the best educational institutions in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-12">
              Loading...
            </div>
          ) : institutes.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-12">
              No institutes found.
            </div>
          ) : (
            institutes.map((institute) => {
              // Location logic
              const location =
                [institute.city, institute.state?.name, institute.country?.name]
                  .filter(Boolean)
                  .join(", ") ||
                institute.address ||
                "";

              // Institute type
              const type = institute.master_institute_type?.name || "Institute";

              // Verification badge
              const verified = institute.verified ? (
                <Badge className="ml-2 bg-green-100 text-green-700 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Verified
                </Badge>
              ) : null;

              // Rating logic - only show if rating is positive
              const hasRating =
                typeof institute.rating_score === "number" &&
                institute.rating_score > 0;
              const rating = hasRating
                ? (institute.rating_score / 20).toFixed(1)
                : null;

              // Check if there are courses
              const hasCourses = institute.course_count > 0;

              // Check if there are students
              const hasStudents = institute.student_count > 0;

              return (
                <Card
                  key={institute.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                        {institute.logo ? (
                          <Image
                            src={institute.logo}
                            alt={institute.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                            {getInitials(institute.name)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
                          {institute.name}
                          {verified}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {location}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{type}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {/* {hasRating && (
                        <div className="text-center">
                          <div className="flex items-center justify-center text-yellow-500 mb-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm ml-1 font-semibold">
                              {rating}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                      )} */}

                      {/* {hasCourses && (
                        <div className="text-center">
                          <div className="flex items-center justify-center text-blue-600 mb-1">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span className="text-sm font-semibold">
                              {institute.course_count}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Courses</div>
                        </div>
                      )} */}

                      {/* {hasStudents && (
                        <div className="text-center">
                          <div className="flex items-center justify-center text-purple-600 mb-1">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm font-semibold">
                              {institute.student_count}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Students</div>
                        </div>
                      )} */}

                      {/* If no stats are available, show a placeholder */}
                      {/* {!hasRating && !hasCourses && !hasStudents && (
                        <div className="text-center col-span-3">
                          <div className="text-xs text-gray-400 italic">
                            No statistics available
                          </div>
                        </div>
                      )} */}
                    </div>

                    <Link href={`/institutes/${institute.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                        View Institute
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Only show the button if there are institutes */}
        {institutes.length > 0 && !loading && (
          <div className="text-center">
            <Link href="/institutes">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Institutes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
