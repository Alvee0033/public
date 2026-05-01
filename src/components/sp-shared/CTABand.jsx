import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Dark CTA band, used at the bottom of pages.
 * Optional `note` for trust copy underneath the buttons.
 */
export default function CTABand({
  eyebrow,
  title,
  sub,
  primaryCta,
  secondaryCta,
  note,
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--sp-navy)] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-50" />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(40,132,171,.45), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-24 h-[360px] w-[360px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(236,94,35,.30), transparent 70%)",
        }}
      />

      <div className="container relative section-py">
        <div className="max-w-3xl">
          {eyebrow && <span className="eyebrow !text-[#7BC9E8]">{eyebrow}</span>}
          <h2 className="h-1 mt-3 !text-white text-balance">{title}</h2>
          {sub && (
            <p className="lede mt-5 max-w-xl !text-white/80 text-pretty">{sub}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta && (
              <Link href={primaryCta.href} className="btn-on-dark btn-lg">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn-on-dark-outline">
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {note && (
            <p className="mt-6 text-[13px] text-white/55">{note}</p>
          )}
        </div>
      </div>
    </section>
  );
}
