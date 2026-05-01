"use client";

import { HubStatusBadge } from "./HubStatusBadge";
import { HubScoreBar } from "./HubScoreBar";
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HubCard({ hub }) {
  const router = useRouter();
  const isRejected = hub.status === "rejected";
  const isPending = hub.status === "pending";
  const isActive = hub.status === "active";

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div
        className={`h-1 w-full ${
          isActive
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : isPending
              ? "bg-gradient-to-r from-amber-400 to-orange-400"
              : "bg-gradient-to-r from-red-400 to-rose-400"
        }`}
      />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base leading-tight truncate mb-1">
              {hub.hub_name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden />
              <span className="truncate">
                {[hub.city, hub.state_code, hub.country_code]
                  .filter(Boolean)
                  .join(", ") || hub.address_line1 || "Location not set"}
              </span>
            </div>
          </div>
          <HubStatusBadge status={hub.status} />
        </div>

        {isActive && (
          <div className="mb-4">
            <HubScoreBar score={hub.hub_class_score ?? 0} />
          </div>
        )}

        {isPending && (
          <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-amber-800">
                Awaiting admin review
              </p>
              <p className="text-xs text-amber-700">
                Typically processed within 72 hours.
              </p>
            </div>
          </div>
        )}

        {isRejected && hub.rejection_reason && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-red-800">
                Rejection Reason
              </p>
              <p className="text-xs text-red-700">{hub.rejection_reason}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center bg-slate-50 rounded-xl p-2.5 border border-slate-100/80">
            <div className="text-lg font-bold text-slate-900">
              {hub.student_count ?? 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Students</div>
          </div>
          <div className="text-center bg-slate-50 rounded-xl p-2.5 border border-slate-100/80">
            <div className="text-lg font-bold text-slate-900">
              {hub.tutor_count ?? 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Tutors</div>
          </div>
          <div className="text-center bg-slate-50 rounded-xl p-2.5 border border-slate-100/80">
            <div className="text-lg font-bold text-slate-900">
              {Number(hub.avg_rating ?? 0).toFixed(1)}
            </div>
            <div className="text-xs text-slate-500 font-medium">Rating</div>
          </div>
        </div>

        {hub.services_offered?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hub.services_offered.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium"
              >
                {s}
              </span>
            ))}
            {hub.services_offered.length > 3 && (
              <span className="text-xs text-slate-400">
                +{hub.services_offered.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
          {hub.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" aria-hidden />
              <span className="truncate max-w-[120px]">{hub.email}</span>
            </span>
          )}
          {hub.website_url && (
            <a
              href={hub.website_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <Globe className="w-3 h-3" aria-hidden />
              Website
            </a>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {isActive && (
            <button
              type="button"
              onClick={() =>
                router.push(`/lms/hub-dashboard?tab=score&hub=${hub.id}`)
              }
              className="flex-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" aria-hidden />
              View Score
            </button>
          )}
          {isRejected && (
            <Link
              href="/learninghubs/register"
              className="flex-1 text-xs font-semibold border border-red-300 text-red-600 hover:bg-red-50 rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5"
            >
              Edit &amp; Resubmit
            </Link>
          )}
          {isPending && (
            <div className="flex-1 text-xs font-semibold bg-slate-100 text-slate-500 rounded-xl py-2.5 text-center cursor-not-allowed">
              Pending Approval
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
