"use client";

export default function SectionErrorState() {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8">
      <p className="text-sm font-semibold text-rose-700">
        Could not load section data. Please refresh and try again.
      </p>
    </div>
  );
}

