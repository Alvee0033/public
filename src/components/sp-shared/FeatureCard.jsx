import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Standard feature/benefit card.
 * `icon` is a Lucide icon component. `accent` controls the icon-tile color.
 */
export default function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  accent = "blue",
  className = "",
}) {
  const tile =
    accent === "navy"
      ? "bg-[var(--sp-navy)] text-white"
      : accent === "orange"
      ? "bg-[var(--sp-orange-light)] text-[var(--sp-orange)]"
      : accent === "purple"
      ? "bg-[var(--sp-purple-light)] text-[var(--sp-purple)]"
      : "bg-[var(--sp-blue-light)] text-[var(--sp-navy)]";

  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        "sp-card group block p-6 sm:p-7 h-full",
        href ? "cursor-pointer" : "",
        className,
      ].join(" ")}
    >
      {Icon && (
        <div
          className={[
            "inline-flex items-center justify-center h-11 w-11 rounded-[10px]",
            tile,
          ].join(" ")}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      )}

      <div className={Icon ? "mt-5" : ""}>
        <h3 className="text-[1.0625rem] font-semibold text-[var(--sp-ink)] tracking-tight leading-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--sp-muted)]">
            {description}
          </p>
        )}
      </div>

      {href && (
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sp-navy)] group-hover:text-[var(--sp-blue)] transition-colors">
          Learn more
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2.25}
          />
        </span>
      )}
    </Wrapper>
  );
}
