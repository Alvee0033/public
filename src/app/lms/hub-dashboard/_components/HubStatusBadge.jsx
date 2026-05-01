import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const STATUS = {
  active: {
    label: "Active",
    icon: CheckCircle,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending Review",
    icon: Clock,
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  waitlist: {
    label: "Waitlist",
    icon: Clock,
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  suspended: {
    label: "Suspended",
    icon: AlertCircle,
    cls: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

export function HubStatusBadge({ status }) {
  const cfg = STATUS[status] ?? STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
