"use client";

import React, { useEffect, useState } from "react";
import { instance } from "../../../lib/axios";
import Link from "next/link";

export default function ProductCategoriesPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    instance
      .get("/product-categories")
      .then((res) => {
        if (!mounted) return;
        setCats(res.data?.data || []);
      })
      .catch((err) => setError(err?.message || "Failed to load categories"))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Categories</h1>

      {loading ? (
        <div className="py-12 text-center">Loading categories...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/product-list?category=${encodeURIComponent(c.name)}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.icon || "/images/placeholder.jpg"}
                  alt={c.name}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.description || ""}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
