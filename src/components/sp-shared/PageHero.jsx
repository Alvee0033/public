"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Reusable page hero with eyebrow, headline, lede, CTAs, and optional stat row.
 * Variants: "light" (default) and "dark" (navy background).
 */
export default function PageHero({
  eyebrow,
  title,
  highlight,
  lede,
  primaryCta,
  secondaryCta,
  stats,
  variant = "light",
  align = "left",
}) {
  const isDark = variant === "dark";
  const isCenter = align === "center";

  return (
    <section
      className={[
        "relative overflow-hidden",
        isDark
          ? "bg-[var(--sp-navy)] text-white"
          : "bg-white text-[var(--sp-ink)]",
      ].join(" ")}
    >
      {/* Subtle background pattern */}
      <div
        aria-hidden="true"
        className={[
          "absolute inset-0 pointer-events-none",
          isDark ? "bg-grid-dark opacity-60" : "bg-dotgrid opacity-50",
        ].join(" ")}
      />
      {isDark && (
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(40,132,171,.45), transparent 70%)",
          }}
        />
      )}

      <div className="container relative section-py">
        <div
          className={[
            "max-w-3xl",
            isCenter ? "mx-auto text-center" : "",
          ].join(" ")}
        >
          {eyebrow && (
            <span
              className={[
                "eyebrow anim-fade-up anim-d0",
                isDark ? "!text-[#7BC9E8]" : "",
              ].join(" ")}
            >
              {eyebrow}
            </span>
          )}

          <h1
            className={[
              "h-display mt-4 anim-fade-up anim-d1 text-balance",
              isDark ? "!text-white" : "",
            ].join(" ")}
          >
            {title}
            {highlight && (
              <>
                {" "}
                <span className="font-display italic font-normal text-[var(--sp-orange)]">
                  {highlight}
                </span>
              </>
            )}
          </h1>

          {lede && (
            <p
              className={[
                "lede mt-6 anim-fade-up anim-d2 text-pretty max-w-2xl",
                isCenter ? "mx-auto" : "",
                isDark ? "!text-white/80" : "",
              ].join(" ")}
            >
              {lede}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div
              className={[
                "mt-8 flex flex-wrap gap-3 anim-fade-up anim-d3",
                isCenter ? "justify-center" : "",
              ].join(" ")}
            >
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className={isDark ? "btn-on-dark btn-lg" : "btn-primary btn-lg"}
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className={isDark ? "btn-on-dark-outline" : "btn-outline btn-lg"}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div
            className={[
              "mt-14 grid gap-y-8 gap-x-6",
              "grid-cols-2 md:grid-cols-4",
              "anim-fade-up anim-d4",
            ].join(" ")}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className={["stat-num", isDark ? "stat-num-on-dark" : ""].join(" ")}>
                  {s.value}
                </div>
                <div className={["stat-label", isDark ? "stat-label-on-dark" : ""].join(" ")}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
