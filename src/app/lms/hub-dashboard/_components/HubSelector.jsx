"use client";

import { Building2, ChevronRight } from "lucide-react";
import { useState } from "react";

export function HubSelector({ hubs, selectedHubId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentHub =
    hubs.find((hub) => String(hub.id) === selectedHubId) || hubs[0];

  return (
    <div className="relative min-w-[260px]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((value) => !value)}
        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-sm hover:border-blue-400 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Building2 className="w-4 h-4" aria-hidden />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-[11px] font-bold text-slate-900 truncate uppercase tracking-tight">
              {currentHub?.hub_name}
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {currentHub?.city || "Primary Node"}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute top-full right-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden"
            role="listbox"
          >
            <div className="p-2 space-y-1">
              {hubs.map((hub) => (
                <button
                  type="button"
                  key={hub.id}
                  role="option"
                  aria-selected={String(hub.id) === selectedHubId}
                  onClick={() => {
                    onSelect(String(hub.id));
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    String(hub.id) === selectedHubId
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      String(hub.id) === selectedHubId
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Building2 className="w-4 h-4" aria-hidden />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold truncate">{hub.hub_name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                      {hub.city}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
