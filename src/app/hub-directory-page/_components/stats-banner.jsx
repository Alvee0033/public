import React from "react";

export function StatsBanner({ summary }) {
  return (
    <div className="mb-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{summary?.total || 0}</div>
          <div className="text-gray-600">Active Hubs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {summary?.countryCount || 0}
          </div>
          <div className="text-gray-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {summary?.cityCount || 0}
          </div>
          <div className="text-gray-600">Cities</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {summary?.featuredCount || 0}
          </div>
          <div className="text-gray-600">Featured Hubs</div>
        </div>
      </div>
    </div>
  );
}
