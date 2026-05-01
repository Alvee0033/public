"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Star, Users } from "lucide-react";

export function DistrictList({ hubs = [], loading = false }) {
  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Building2 className="h-5 w-5" />
            Featured Hubs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Building2 className="h-5 w-5" />
          Featured Hubs
          <Badge variant="secondary" className="ml-2">
            {hubs.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-800">{hub.hub_name}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {[hub.city || hub.master_city?.name, hub.master_state?.name || hub.state_code, hub.master_country?.name || hub.country_code]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {hub.hub_class_label}
                </Badge>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {Number(hub.avg_rating || 0).toFixed(1)} rating
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {hub.student_count || 0} students
                </span>
                <span>Score {hub.hub_class_score || 0}</span>
              </div>

              {hub.services_offered?.length ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {hub.services_offered.slice(0, 3).map((service) => (
                    <Badge
                      key={`${hub.id}-${service}`}
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{hub.address_line1}</div>
                <Button asChild size="sm" variant="ghost" className="text-blue-600">
                  <Link href={`/hub-directory-page/${hub.id}`}>
                    View
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {hubs.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No active hubs match the current search.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
