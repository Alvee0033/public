/**
 * Section wrapper: consistent vertical rhythm + optional eyebrow/title/sub.
 */
export default function Section({
  eyebrow,
  title,
  sub,
  align = "left",
  tone = "white",
  size = "md",
  id,
  children,
  className = "",
  headerAction,
}) {
  const toneClass =
    tone === "soft"
      ? "bg-[var(--sp-gray-50)]"
      : tone === "navy"
      ? "bg-[var(--sp-navy)] text-white"
      : "bg-white";

  const padClass = size === "sm" ? "section-py-sm" : "section-py";

  return (
    <section id={id} className={[toneClass, padClass, className].join(" ")}>
      <div className="container">
        {(eyebrow || title || sub || headerAction) && (
          <div
            className={[
              "mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
              align === "center" ? "md:!flex-col md:items-center text-center" : "",
            ].join(" ")}
          >
            <div className={align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}>
              {eyebrow && (
                <span
                  className={[
                    "eyebrow",
                    tone === "navy" ? "!text-[#7BC9E8]" : "",
                  ].join(" ")}
                >
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2
                  className={[
                    "section-title mt-3 text-balance",
                    tone === "navy" ? "!text-white" : "",
                  ].join(" ")}
                >
                  {title}
                </h2>
              )}
              {sub && (
                <p
                  className={[
                    "section-sub mt-4 text-pretty",
                    align === "center" ? "mx-auto" : "",
                    tone === "navy" ? "!text-white/75" : "",
                  ].join(" ")}
                >
                  {sub}
                </p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
