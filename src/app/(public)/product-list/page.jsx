"use client";

import React, { useEffect, useMemo, useState } from "react";
import { instance } from "../../../lib/axios";
import { useSearchParams } from "next/navigation";

function Price({ regular_price }) {
  return (
    <span className="text-lg font-semibold text-gray-900">
      ${regular_price?.toFixed(2)}
    </span>
  );
}

function ProductCard({ p }) {
  const img = p.primary_image || "/images/placeholder.jpg";
  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        <img src={img} alt={p.name} className="object-contain h-40" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 truncate">{p.name}</h3>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {p.product_category?.name}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <Price regular_price={p.regular_price} />
          <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => {
    try {
      const c =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("category");
      return c || "all";
    } catch (e) {
      return "all";
    }
  });
  const [sort, setSort] = useState("name_asc");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    instance
      .get("/products")
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data || [];
        setProducts(data);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load products");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    // sync with URL when user navigates to ?category=...
    const param =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("category")
        : null;
    if (param && param !== category) setCategory(param);
  }, [searchParams]);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const name = p.product_category?.name || "Uncategorized";
      if (!map.has(name)) map.set(name, { name, count: 0 });
      map.get(name).count++;
    });
    return [
      { name: "All", key: "all" },
      ...Array.from(map.values()).map((c) => ({
        name: `${c.name} (${c.count})`,
        key: c.name,
      })),
    ];
  }, [products]);

  const filtered = useMemo(() => {
    let out = products.slice();
    if (query) {
      const q = query.toLowerCase();
      out = out.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (category && category !== "all") {
      out = out.filter((p) => p.product_category?.name === category);
    }
    if (sort === "price_asc")
      out.sort((a, b) => (a.regular_price || 0) - (b.regular_price || 0));
    if (sort === "price_desc")
      out.sort((a, b) => (b.regular_price || 0) - (a.regular_price || 0));
    if (sort === "name_asc")
      out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sort === "name_desc")
      out.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    return out;
  }, [products, query, category, sort]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <section className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full border rounded px-3 py-2"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
            <option value="price_asc">Price Low → High</option>
            <option value="price_desc">Price High → Low</option>
          </select>
        </div>

        <div className="md:ml-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {categories.map((c) => (
              <option
                key={c.key}
                value={
                  c.key === "all" ? "all" : c.key.replace(/\s\(\d+\)$/, "")
                }
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20">Loading products...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <section>
          <div className="text-sm text-gray-600 mb-4">
            {filtered.length} product(s) found
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
