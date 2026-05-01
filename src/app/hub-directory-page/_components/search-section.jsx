"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal } from "lucide-react";

const HUB_CLASSES = ["all", "Starter", "Bronze", "Silver", "Gold", "Class 150"];

const SERVICES = [
  { id: "Tutoring", label: "Tutoring" },
  { id: "STEM Lab", label: "STEM Lab" },
  { id: "Bootcamp", label: "Bootcamp" },
  { id: "Device Rental", label: "Device Rental" },
];

export function SearchSection({ onSearch, filters }) {
  const [query, setQuery] = useState(filters?.query || "");
  const [hubClass, setHubClass] = useState(filters?.hubClass || "all");
  const [services, setServices] = useState(filters?.services || []);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQuery(filters?.query || "");
    setHubClass(filters?.hubClass || "all");
    setServices(filters?.services || []);
  }, [filters]);

  const handleSearch = () => {
    onSearch({
      query: query.trim(),
      hubClass,
      services,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const toggleService = (serviceId) => {
    setServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by hub name, city, state, or country"
            className="border-white/30 bg-white/90 pl-10 text-gray-800 placeholder:text-gray-500"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <Select value={hubClass} onValueChange={setHubClass}>
          <SelectTrigger className="w-full border-white/30 bg-white/90 text-gray-800 md:w-52">
            <SelectValue placeholder="All Hub Classes" />
          </SelectTrigger>
          <SelectContent>
            {HUB_CLASSES.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All Hub Classes" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="w-full border-white/30 bg-white/90 text-gray-800 hover:bg-white md:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Filters
          {services.length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs font-bold bg-orange-500 text-white rounded-full">
              {services.length}
            </span>
          )}
        </Button>

        <Button className="bg-orange-500 px-8 text-white hover:bg-orange-600" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="mt-4 border-t border-white/20 pt-4">
          <p className="text-sm font-medium text-white/90 mb-3">Filter by Services</p>
          <div className="flex flex-wrap gap-4">
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={services.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                  className="border-white/60 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <span className="text-sm text-white/90">{service.label}</span>
              </label>
            ))}
          </div>
          {services.length > 0 && (
            <button
              onClick={() => setServices([])}
              className="mt-2 text-xs text-white/60 hover:text-white underline"
            >
              Clear service filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
