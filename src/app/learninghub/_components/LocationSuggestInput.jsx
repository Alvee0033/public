"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import { Search, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LocationSuggestInput
 * A specialized input that fetches and displays location suggestions.
 * Optimized for inclusion in the high-density Airbnb-style filter bar.
 */
export function LocationSuggestInput({
  value,
  onChange,
  onPickSuggestion,
  className,
  inputClassName,
  placeholder = "City, state, or country…",
  hideIcon = false,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggest = useCallback(async (q) => {
    const t = q.trim();
    if (t.length < 2) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("/learning-hub/location-suggestions", {
        params: { q: t },
        skipErrorLog: true,
      });
      const list = res?.data?.data?.suggestions ?? res?.data?.suggestions ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggest(value);
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggest]);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative w-full min-w-0", className)}>
      {!hideIcon && (
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-8 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 transition-all hover:border-[var(--sp-blue)]/50 focus:border-[var(--sp-blue)] focus:outline-none focus:ring-4 focus:ring-[var(--sp-blue)]/10",
          inputClassName
        )}
        autoComplete="off"
      />
      {loading ? (
        <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--sp-blue)]" />
      ) : null}

      {open && items.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-[100] mt-3 max-h-72 overflow-auto rounded-[1.5rem] border border-slate-100 bg-white/95 backdrop-blur-2xl p-2 shadow-2xl ring-1 ring-black/[0.05] animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((s, i) => (
            <li key={`${s.label}-${i}`}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-[var(--sp-blue)]"
                onClick={() => {
                  onPickSuggestion?.(s);
                  onChange(s.label);
                  setOpen(false);
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100/50 text-slate-400 transition-colors group-hover:bg-sky-50 group-hover:text-[var(--sp-blue)]">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-snug">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
