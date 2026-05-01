"use client";
import { useEffect, useRef, useState } from "react";

const LocationModal = ({ isOpen, onClose, onSelectState, selectedState }) => {
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [searchingZip, setSearchingZip] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastApiCallTime = useRef(0);

  // Function to close the modal
  const closeLocationModal = () => {
    // Start the closing animation
    setIsModalClosing(true);

    // Actually remove the modal after animation completes
    setTimeout(() => {
      onClose();
      setIsModalClosing(false);
      setLocationError(null);
    }, 300);
  };

  // Add this function for caching and rate limiting
  const getNominatimData = async (url) => {
    // Check for cached result first
    const cacheKey = `nominatim_cache_${url}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        // Cache valid for 24 hours (86400000 ms)
        if (Date.now() - timestamp < 86400000) {
          console.log("Using cached location data");
          return data;
        }
      } catch (e) {
        console.error("Error parsing cached data:", e);
      }
    }

    // Rate limiting - ensure 1 second between API calls
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime.current;

    if (timeSinceLastCall < 1000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 - timeSinceLastCall)
      );
    }

    // Make the API call
    lastApiCallTime.current = Date.now();

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ScholarPASS Website (https://tutorsplan.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );

    return data;
  };

  // Location related functions
  const getUserLocation = async () => {
    setLocationError(null);
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setLocationLoading(false);
      return;
    }

    try {
      // Try to get position from cache first
      const cachedPosition = localStorage.getItem("user_location_coords");

      if (cachedPosition) {
        try {
          const { latitude, longitude, timestamp } = JSON.parse(cachedPosition);

          // Cache valid for 1 hour
          if (Date.now() - timestamp < 3600000) {
            // Use cached coordinates but still fetch the state name
            await fetchStateFromCoordinates(latitude, longitude);
            return;
          }
        } catch (e) {
          console.log("Error using cached position:", e);
        }
      }

      // Get current position if no cache or cache expired
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Cache the coordinates
          localStorage.setItem(
            "user_location_coords",
            JSON.stringify({
              latitude,
              longitude,
              timestamp: Date.now(),
            })
          );

          await fetchStateFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(getLocationErrorMessage(error.code));
          setLocationLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } catch (error) {
      console.error("Geolocation error:", error);
      setLocationError("Failed to get location");
      setLocationLoading(false);
    }
  };

  // Helper function to get error messages
  const getLocationErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 1:
        return "Location access denied";
      case 2:
        return "Location unavailable";
      case 3:
        return "Request timed out";
      default:
        return "Unknown error";
    }
  };

  // Helper function to fetch state from coordinates
  const fetchStateFromCoordinates = async (latitude, longitude) => {
    try {
      // Build the Nominatim URL
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

      // Use the cached/rate-limited function
      const data = await getNominatimData(url);

      // Extract state from address components
      const state =
        data.address.state ||
        data.address.province ||
        data.address.region ||
        data.address.county ||
        "Unknown location";

      onSelectState(state);
      setLocationLoading(false);
      closeLocationModal();
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationError("Failed to determine location");
      setLocationLoading(false);
    }
  };

  // Function to handle zip code search form submission
  const handleZipSearch = async (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    setSearchingZip(true);
    setLocationError(null);

    try {
      // Use Nominatim to search by zip code
      const url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(
        zipCode.trim()
      )}&limit=1&addressdetails=1`;

      const results = await getNominatimData(url);

      if (results && results.length > 0) {
        const result = results[0];
        const state =
          result.address.state ||
          result.address.province ||
          result.address.region ||
          "Unknown location";

        onSelectState(state);
        setZipCode("");
        closeLocationModal();
      } else {
        setLocationError("Location not found for this zip code");
      }
    } catch (error) {
      console.error("Zip search error:", error);
      setLocationError("Failed to search location");
    } finally {
      setSearchingZip(false);
    }
  };

  // Improved location search function
  const handleOpenLocationSearch = (query) => {
    if (!query || query.trim() === "") return;

    setLocationLoading(true);
    setLocationError(null);

    // Use the search input to find location
    searchLocation(query.trim());
  };

  // Location search implementation
  const searchLocation = async (query) => {
    try {
      // Build the Nominatim search URL
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=1`;

      // Use the cached/rate-limited function
      const results = await getNominatimData(url);

      if (results && results.length > 0) {
        // Extract the state from the first result
        const result = results[0];
        const state =
          result.address.state ||
          result.address.province ||
          result.address.region ||
          result.address.county ||
          "Unknown location";

        onSelectState(state);
        closeLocationModal();
      } else {
        setLocationError("Location not found");
      }
    } catch (error) {
      console.error("Location search error:", error);
      setLocationError("Failed to search location");
    } finally {
      setLocationLoading(false);
    }
  };

  // Add this function to handle location suggestions
  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length >= 2) {
      fetchLocationSuggestions(value);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add this function to fetch location suggestions
  const fetchLocationSuggestions = async (query) => {
    try {
      // Limit API calls by adding a small delay
      if (query.length < 2) return;

      // Build the Nominatim search URL
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5`;

      // Use the cached/rate-limited function
      const results = await getNominatimData(url);

      if (results && results.length > 0) {
        // Extract useful information from results
        const suggestions = results.map((result) => {
          return {
            display_name: result.display_name,
            state:
              result.address.state ||
              result.address.province ||
              result.address.region ||
              result.address.county ||
              "Unknown location",
          };
        });

        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add this function to handle suggestion selection
  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.display_name);
    onSelectState(suggestion.state);
    setShowSuggestions(false);
    closeLocationModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999]"
      style={{
        position: "fixed",
        isolation: "isolate",
      }}
      onClick={closeLocationModal}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isModalClosing ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      <div
        className="fixed inset-0 flex items-start justify-center p-4"
        style={{ pointerEvents: "none", paddingTop: "20vh" }}
      >
        <div
          className={`bg-white rounded-xl w-full max-w-md shadow-2xl transition-all duration-300 ${
            isModalClosing
              ? "opacity-0 transform translate-y-4 scale-95"
              : "opacity-100 transform translate-y-0 scale-100"
          }`}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            pointerEvents: "auto",
            maxHeight: "80vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Choose your location
            </h2>
            <button
              onClick={closeLocationModal}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            <button
              onClick={getUserLocation}
              disabled={locationLoading}
              className="w-full py-2.5 px-4 bg-secondaryColor hover:bg-secondaryColor disabled:bg-secondaryColor rounded-md font-medium text-sm transition-colors flex items-center justify-center text-white"
            >
              {locationLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Getting your location...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Use my current location
                </>
              )}
            </button>

            <div className="h-px bg-gray-200 my-4" />

            <form onSubmit={handleZipSearch}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter a US zip code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter zip code"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondaryColor focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={searchingZip || !zipCode.trim()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md font-medium disabled:opacity-50 transition-colors"
                >
                  {searchingZip ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-1"></span>
                      <span>Searching...</span>
                    </span>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            </form>

            <div className="h-px bg-gray-200 my-4" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenLocationSearch(searchQuery);
              }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter location name
              </label>
              <div className="flex gap-2 relative">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleLocationInputChange}
                    placeholder="City, State, or Region"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondaryColor focus:border-transparent"
                    autoComplete="off"
                  />
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-60 overflow-y-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2.5 hover:bg-secondaryColor cursor-pointer text-sm border-b border-gray-100 last:border-b-0 truncate"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={locationLoading || !searchQuery.trim()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md font-medium disabled:opacity-50 transition-colors"
                >
                  {locationLoading && searchQuery.trim() ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-1"></span>
                      <span>Searching...</span>
                    </span>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>

            {locationError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-rose-500 font-medium">
                  {locationError}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={closeLocationModal}
              className="px-6 py-2.5 bg-secondaryColor hover:bg-secondaryColor rounded-md font-medium text-sm transition-colors text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
