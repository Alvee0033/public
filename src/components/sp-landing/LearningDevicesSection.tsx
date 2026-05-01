"use client";

import React from "react";
import { Laptop, Smartphone, Watch, ShoppingBag, ShieldCheck, Truck, Sparkles, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DEVICES = [
  {
    name: "AI Chromebook Elite",
    price: "$299",
    category: "Laptops",
    icon: Laptop,
    image: "/images/chromebook-lifestyle.png",
    credits: "$450 SRP",
  },
  {
    name: "ScholarPad Pro",
    price: "$199",
    category: "Tablets",
    icon: Smartphone,
    image: "/images/tablet-with-stylus.jpg",
    credits: "$320 SRP",
  },
  {
    name: "STEM Robotics Kit",
    price: "$149",
    category: "STEM Hardware",
    icon: Watch,
    image: "/images/robotics-kit.jpg",
    credits: "$250 SRP",
  },
];

const BENEFITS = [
  { icon: Truck,      title: "Free Global Shipping", desc: "Delivered in 3-5 business days." },
  { icon: ShieldCheck,title: "3-Year Warranty",      desc: "Zero-cost hardware protection." },
  { icon: Sparkles,   title: "Ready to Learn",       desc: "Pre-installed education apps." },
  { icon: Award,      title: "Trade-In Program",     desc: "Upgrade your device easily." },
];

export default function LearningDevicesSection() {
  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="container">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "var(--sp-blue-light)", color: "var(--sp-navy)" }}
            >
              The Gear Shop
            </span>
            <h2 className="section-title">
              Equip Your{" "}
              <span style={{ color: "var(--sp-blue)" }}>Learning Toolkit.</span>
            </h2>
            <p className="section-sub mt-2">
              Certified learning devices and STEM kits. Redeem your ScholarPASS credits for hardware and educational tools.
            </p>
          </div>

          <Link
            href="/devices"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-lg text-[13.5px] font-bold border-2 transition-all flex-shrink-0"
            style={{ borderColor: "var(--sp-ink)", color: "var(--sp-ink)", background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-ink)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sp-ink)"; }}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            Browse Full Shop
          </Link>
        </div>

        {/* Device cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {DEVICES.map((device, i) => {
            const IconComponent = device.icon;
            return (
              <article
                key={device.name}
                className="group flex flex-col rounded-xl border bg-[var(--sp-off)] overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-xl"
                style={{ borderColor: "var(--sp-border)", animationDelay: `${i * 80}ms` }}
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <Image
                    src={device.image}
                    alt={device.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  />
                  <div className="absolute top-4 right-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border shadow-sm"
                      style={{ borderColor: "var(--sp-border)", color: "var(--sp-navy)" }}
                      aria-hidden="true"
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--sp-light)" }}>
                    {device.category}
                  </span>
                  <h3 className="text-[16px] font-bold mb-4 group-hover:text-[var(--sp-blue)] transition-colors" style={{ color: "var(--sp-ink)" }}>
                    {device.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: "var(--sp-border)" }}>
                    <div>
                      <div className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--sp-ink)" }}>{device.price}</div>
                      <div className="text-[10px] font-semibold line-through" style={{ color: "var(--sp-light)" }}>{device.credits}</div>
                    </div>
                    <button
                      type="button"
                      className="px-4 h-10 rounded-lg text-[12.5px] font-bold text-white transition-all"
                      style={{ background: "var(--sp-navy)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sp-blue)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sp-navy)"; }}
                    >
                      Redeem Credits
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Benefits strip */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 p-6 lg:p-8 rounded-2xl border"
          style={{ background: "var(--sp-off)", borderColor: "var(--sp-border)" }}
          aria-label="Shopping benefits"
        >
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border bg-white"
                style={{ borderColor: "var(--sp-border)", color: "var(--sp-blue)" }}
                aria-hidden="true"
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[13px] font-bold mb-0.5" style={{ color: "var(--sp-ink)" }}>{title}</h5>
                <p className="text-[11.5px] font-medium" style={{ color: "var(--sp-light)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
