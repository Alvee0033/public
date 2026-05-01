"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, BookOpen } from "lucide-react";
import { Logo } from "@/app/hub-directory-page/_components/logo";
import { StatsBanner } from "@/app/hub-directory-page/_components/stats-banner";
import { InteractiveMap } from "@/app/hub-directory-page/_components/interactive-map";
import { DistrictList } from "@/app/hub-directory-page/_components/district-list";
import { CityList } from "@/app/hub-directory-page/_components/city-list";
import { SearchSection } from "@/app/hub-directory-page/_components/search-section";

const EMPTY_STATE = {
  items: [],
  total: 0,
  page: 1,
  limit: 12,
};

export default function HubDirectoryPage() {
  const [viewMode, setViewMode] = useState("map");
  const [searchFilters, setSearchFilters] = useState({
    query: "",
    hubClass: "all",
    services: [],
  });
  const [hubResult, setHubResult] = useState(EMPTY_STATE);
  const [mapData, setMapData] = useState({ type: "FeatureCollection", features: [] });
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchHubs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/learning-hub", {
          params: {
            q: searchFilters.query || undefined,
            hub_class:
              searchFilters.hubClass && searchFilters.hubClass !== "all"
                ? searchFilters.hubClass
                : undefined,
            services_offered:
              searchFilters.services?.length > 0
                ? searchFilters.services
                : undefined,
            limit: 12,
          },
        });

        if (!mounted) {
          return;
        }

        setHubResult(response?.data?.data || EMPTY_STATE);
      } catch (fetchError) {
        if (!mounted) {
          return;
        }

        setError(
          fetchError?.response?.data?.message ||
            "We could not load the active Hub directory right now.",
        );
        setHubResult(EMPTY_STATE);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHubs();
    return () => {
      mounted = false;
    };
  }, [searchFilters]);

  useEffect(() => {
    let mounted = true;

    const fetchMap = async () => {
      setMapLoading(true);
      setMapError("");

      try {
        const response = await axios.get("/learning-hub/map");
        if (!mounted) {
          return;
        }

        setMapData(
          response?.data?.data || { type: "FeatureCollection", features: [] },
        );
      } catch (fetchError) {
        if (!mounted) {
          return;
        }

        setMapError("The Hub map is unavailable right now.");
        setMapData({ type: "FeatureCollection", features: [] });
      } finally {
        if (mounted) {
          setMapLoading(false);
        }
      }
    };

    fetchMap();
    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const items = hubResult?.items || [];
    const countryCount = new Set(
      items.map((hub) => hub.country_code || hub.master_country?.name).filter(Boolean),
    ).size;
    const cityCount = new Set(
      items.map((hub) => hub.city || hub.master_city?.name).filter(Boolean),
    ).size;
    const featuredCount = items.filter((hub) => hub.featured).length;

    return {
      total: hubResult?.total || 0,
      countryCount,
      cityCount,
      featuredCount,
    };
  }, [hubResult]);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/hub-directory-page"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Hub Directory
            </Link>
            <Link
              href="/lms/hub-dashboard"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Register a Hub
            </Link>
            <Link href="/" className="text-gray-600 transition-colors hover:text-blue-600">
              ScholarPASS
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-blue-200 bg-transparent text-blue-600 hover:bg-blue-50"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/lms/hub-dashboard">Become a Hub Operator</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Global ScholarPASS Hub Directory
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-blue-100">
              Search active ScholarPASS learning hubs by city, state, country, and
              Hub Class. Discover the nearest center, compare offerings, and browse
              a live global network from one directory.
            </p>
          </div>

          <StatsBanner summary={summary} />
          <SearchSection onSearch={handleSearch} filters={searchFilters} />
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Active Hubs</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {summary.total} listed
            </Badge>
            {searchFilters.query ? (
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                Search: {searchFilters.query}
              </Badge>
            ) : null}
            {searchFilters.hubClass !== "all" ? (
              <Badge variant="outline" className="border-purple-200 text-purple-700">
                Class: {searchFilters.hubClass}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Globe className="mr-2 h-4 w-4" />
              Map View
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              List View
            </Button>
          </div>
        </div>
      </section>

      {viewMode === "map" ? (
        <section className="flex-1 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <InteractiveMap
              data={mapData}
              loading={mapLoading}
              error={mapError}
              searchQuery={searchFilters.query}
            />
          </div>
        </section>
      ) : null}

      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-2">
            <DistrictList hubs={hubResult?.items || []} loading={loading} />
            <CityList hubs={hubResult?.items || []} loading={loading} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Operate a ScholarPASS Hub</h2>
          <p className="mb-8 text-xl text-blue-100">
            Register your local learning hub, upload your KYC documents, and join the
            global ScholarPASS network.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="bg-white px-8 text-blue-600 hover:bg-gray-100">
              <Link href="/lms/hub-dashboard">Register Your Hub</Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-white bg-transparent px-8 text-white hover:bg-white/10"
            >
              <Link href="/hub-directory-page">Browse the Network</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
