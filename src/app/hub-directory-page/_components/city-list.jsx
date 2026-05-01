"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users } from "lucide-react";

export function CityList({ hubs = [], loading = false }) {
  const cities = useMemo(() => {
    const grouped = new Map();

    hubs.forEach((hub) => {
      const cityName = hub.city || hub.master_city?.name || "Unknown City";
      const stateName = hub.master_state?.name || hub.state_code || "";
      const key = `${cityName}-${stateName}`;

      const existing = grouped.get(key) || {
        id: key,
        name: cityName,
        state: stateName,
        districts: 0,
        students: 0,
        averageScore: 0,
        ratings: [],
      };

      existing.districts += 1;
      existing.students += Number(hub.student_count || 0);
      existing.averageScore += Number(hub.hub_class_score || 0);
      existing.ratings.push(Number(hub.avg_rating || 0));
      grouped.set(key, existing);
    });

    return Array.from(grouped.values())
      .map((entry) => ({
        ...entry,
        averageScore: Math.round(entry.averageScore / Math.max(entry.districts, 1)),
        rating:
          entry.ratings.reduce((sum, value) => sum + value, 0) /
          Math.max(entry.ratings.length, 1),
      }))
      .sort((left, right) => right.districts - left.districts)
      .slice(0, 12);
  }, [hubs]);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <MapPin className="h-5 w-5" />
            Hub Cities
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
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MapPin className="h-5 w-5" />
          Hub Cities
          <Badge variant="secondary" className="ml-2">
            {cities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {cities.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{city.name}</div>
                <div className="mt-1 text-sm text-gray-600">📍 {city.state || "Global"}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{city.districts} active hubs</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {city.students} students
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {Number(city.rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Avg Score {city.averageScore}
              </Badge>
            </div>
          ))}
        </div>

        {cities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No active hub cities are available for the current search.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
