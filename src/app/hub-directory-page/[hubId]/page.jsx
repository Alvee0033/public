"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HubProfilePage({ params }) {
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchHub = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/learning-hub/${params.hubId}`);
        if (mounted) {
          setHub(response?.data?.data || null);
        }
      } catch (fetchError) {
        if (mounted) {
          setError("This hub profile could not be loaded.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHub();
    return () => {
      mounted = false;
    };
  }, [params.hubId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16 text-center text-gray-600">
        Loading hub profile...
      </div>
    );
  }

  if (error || !hub) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <p className="mb-6 text-red-700">{error || "Hub not found."}</p>
          <Button asChild>
            <Link href="/hub-directory-page">Back to directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 px-8 py-10 text-white shadow-xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge className="bg-white/20 text-white hover:bg-white/20">
              {hub.hub_class_label}
            </Badge>
            <Badge className="bg-white/20 text-white hover:bg-white/20">
              Score {hub.hub_class_score}
            </Badge>
          </div>
          <h1 className="mb-3 text-3xl font-bold">{hub.hub_name}</h1>
          <p className="max-w-3xl text-blue-100">
            {hub.hub_description || "This ScholarPASS hub is active in the global directory."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Hub Overview</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div className="mt-1 text-gray-800">
                  {[hub.address_line1, hub.address_line2].filter(Boolean).join(", ")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="mt-1 text-gray-800">
                  {[hub.city || hub.master_city?.name, hub.master_state?.name || hub.state_code, hub.master_country?.name || hub.country_code]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="mt-1 text-gray-800">{hub.email || "Not provided"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="mt-1 text-gray-800">{hub.phone_number || "Not provided"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Website</div>
                <div className="mt-1 text-gray-800">{hub.website_url || "Not provided"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">License Expiry</div>
                <div className="mt-1 text-gray-800">{hub.license_expiry_date || "Not provided"}</div>
              </div>
            </div>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">Services</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(hub.services_offered || []).length ? (
                hub.services_offered.map((service) => (
                  <Badge key={service} variant="outline" className="border-blue-200 text-blue-700">
                    {service}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No services listed yet.</span>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Performance</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Hub Class</span>
                  <strong>{hub.hub_class_label}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Score</span>
                  <strong>{hub.hub_class_score}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Students</span>
                  <strong>{hub.student_count || 0}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tutors</span>
                  <strong>{hub.tutor_count || 0}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Rating</span>
                  <strong>{Number(hub.avg_rating || 0).toFixed(1)}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Next Step</h2>
              <p className="mb-4 text-sm text-gray-600">
                Interested in this hub? Contact the operator directly or browse more
                active ScholarPASS hubs in the directory.
              </p>
              <Button asChild className="w-full">
                <Link href="/hub-directory-page">Back to Directory</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
