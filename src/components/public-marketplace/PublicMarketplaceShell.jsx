"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function PublicMarketplaceHero({
  eyebrow,
  title,
  description,
  stats = [],
  primaryAction,
  secondaryAction,
  note,
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(15,118,110,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_55%,_#f8fafc_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.45)_45%,transparent_70%)] opacity-60" />
      <div className="container relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {eyebrow}
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryAction ? (
                <Button
                  asChild={Boolean(primaryAction.href)}
                  size="lg"
                  className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
                  variant={primaryAction.href ? undefined : "default"}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.href ? (
                    <Link href={primaryAction.href}>
                      {primaryAction.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <>
                      {primaryAction.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : null}
              {secondaryAction ? (
                <Button
                  asChild={Boolean(secondaryAction.href)}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-slate-300 bg-white/80 px-6 text-slate-900 shadow-sm hover:bg-slate-50"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.href ? (
                    <Link href={secondaryAction.href}>
                      {secondaryAction.label}
                    </Link>
                  ) : (
                    secondaryAction.label
                  )}
                </Button>
              ) : null}
            </div>
            {note ? (
              <p className="max-w-2xl text-sm text-slate-500">{note}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                <div className="space-y-2">
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  {stat.detail ? (
                    <p className="text-xs leading-5 text-slate-400">
                      {stat.detail}
                    </p>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PublicMarketplaceSection({
  eyebrow,
  title,
  description,
  actions,
  children,
}) {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-700">
            {eyebrow}
          </Badge>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function PublicMarketplaceCard({ className = "", children }) {
  return (
    <Card
      className={`overflow-hidden border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${className}`}
    >
      {children}
    </Card>
  );
}

