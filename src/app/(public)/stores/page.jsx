"use client";

import React, { useEffect, useState } from "react";
import { instance } from "../../../lib/axios";
import Link from "next/link";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    instance
      .get("/stores")
      .then((res) => {
        if (!mounted) return;
        setStores(res.data?.data || []);
      })
      .catch((err) => setError(err?.message || "Failed to load stores"))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>

      {loading ? (
        <div className="py-12 text-center">Loading stores...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stores.map((s) => (
            <div
              key={s.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={s.logo || "/images/placeholder.jpg"}
                  alt={s.name}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <Link
                    href={`/store/${s.id}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {s.name}
                  </Link>
                  <p className="text-sm text-gray-500">{s.city || s.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
