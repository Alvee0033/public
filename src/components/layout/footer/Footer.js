"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail, MapPin, Facebook, Twitter, Linkedin,
  Instagram, Youtube, ArrowRight,
} from "lucide-react";
import { BiLogoTiktok } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const FOOTER_CATEGORIES_CACHE_KEY = "sp_footer_categories_v1";
const FOOTER_CATEGORIES_CACHE_TTL_MS = 10 * 60 * 1000;

const SOCIAL_LINKS = [
  { href: "https://facebook.com",  Icon: Facebook,      label: "Facebook"  },
  { href: "https://x.com",         Icon: Twitter,       label: "X"         },
  { href: "https://tiktok.com",    Icon: BiLogoTiktok,  label: "TikTok"    },
  { href: "https://linkedin.com",  Icon: Linkedin,      label: "LinkedIn"  },
  { href: "https://instagram.com", Icon: Instagram,     label: "Instagram" },
  { href: "https://youtube.com",   Icon: Youtube,       label: "YouTube"   },
];

const PLATFORM_LINKS = [
  { label: "ScholarPASS Plus",  href: "/scholarpass-plus"  },
  { label: "K-12 Tutoring",     href: "/k12-tutoring"      },
  { label: "Career Bootcamps",  href: "/career-bootcamps"  },
  { label: "Learning Devices",  href: "/devices"           },
  { label: "Institute Directory", href: "/institutes"      },
  { label: "Learning Hubs",     href: "/learninghub"       },
];

const COMPANY_LINKS = [
  { label: "About Us",          href: "/about-us"             },
  { label: "Contact",           href: "/contact-us"           },
  { label: "Partnership Program", href: "/partnership-program" },
  { label: "Become a Tutor",    href: "/tutor-volenteers"     },
  { label: "Volunteer Educators", href: "/volunteer-educators" },
  { label: "Blog",              href: "/blogs"                },
];

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(FOOTER_CATEGORIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.expiresAt && parsed.expiresAt > Date.now() && Array.isArray(parsed.items)) {
          setCategories(parsed.items);
          return;
        }
      }
    } catch {}

    async function fetchCategories() {
      try {
        const res = await axios.get("/shop-product-categories/published", { skipErrorLog: true });
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        const next = list.slice(0, 6);
        setCategories(next);
        try {
          sessionStorage.setItem(
            FOOTER_CATEGORIES_CACHE_KEY,
            JSON.stringify({ items: next, expiresAt: Date.now() + FOOTER_CATEGORIES_CACHE_TTL_MS })
          );
        } catch {}
      } catch {
        setCategories([]);
      }
    }

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(fetchCategories, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(fetchCategories, 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <footer className="relative bg-[var(--sp-navy)] text-white/80">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container py-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="eyebrow !text-[#7BC9E8]">Stay informed</span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight !text-white">
                Get scholarship and program updates
              </h3>
              <p className="mt-3 text-[14px] text-white/65 max-w-md">
                Curated drops on new bootcamps, tutoring openings, and scholarship deadlines. No spam.
              </p>
            </div>

            <form
              className="flex w-full max-w-md ml-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <label className="sr-only" htmlFor="newsletter-email">Email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@email.com"
                className="flex-1 h-11 px-4 rounded-[10px] bg-white/8 border border-white/15 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#7BC9E8] focus:bg-white/12 transition"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-[10px] bg-[var(--sp-orange)] hover:bg-[var(--sp-orange-deep)] text-white text-[13.5px] font-semibold transition-colors"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container pt-14 pb-10 lg:pt-16 lg:pb-12">
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center bg-white rounded-[10px] px-3 py-2.5">
              <Image
                src="/icons/scholarpass-logo.png"
                alt="ScholarPASS"
                width={140}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-5 text-[14px] leading-relaxed text-white/65 max-w-sm">
              An education ecosystem connecting students worldwide with scholarships, tutoring, and career-defining programs.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] bg-white/8 border border-white/10 text-white/75 transition hover:bg-white/14 hover:text-white"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-white/65 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-white/65 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories + Contact */}
          <div className="lg:col-span-4">
            {categories.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white mb-5">
                  Browse Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const pu = cat.public_url?.trim();
                    const href = pu?.startsWith("http")
                      ? pu
                      : pu?.startsWith("/")
                      ? pu
                      : `/product-list?category=${encodeURIComponent(cat.name || "")}`;
                    const external = pu?.startsWith("http");
                    const cls = "inline-flex items-center px-3 h-8 rounded-full bg-white/6 border border-white/10 text-[12.5px] text-white/75 hover:bg-white/12 hover:text-white transition-colors";
                    return external ? (
                      <a key={cat.id} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                        {cat.name}
                      </a>
                    ) : (
                      <Link key={cat.id} href={href} className={cls}>
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-white mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] bg-white/8 border border-white/10 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#7BC9E8]" aria-hidden="true" />
                </span>
                <div className="text-[14px] leading-relaxed">
                  <p className="text-white font-semibold">Office</p>
                  <p className="text-white/65">285 Fulton St, New York, NY 10007</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-[8px] bg-white/8 border border-white/10 flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#7BC9E8]" aria-hidden="true" />
                </span>
                <div className="text-[14px] leading-relaxed">
                  <p className="text-white font-semibold">Email</p>
                  <a href="mailto:support@scholarpass.com" className="text-white/65 hover:text-white transition-colors">
                    support@scholarpass.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between">
          <p className="text-[12.5px] text-white/55 order-2 md:order-1">
            © {new Date().getFullYear()} ScholarPASS. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-6 order-1 md:order-2" aria-label="Legal">
            <Link href="/terms" className="text-[12.5px] text-white/65 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy-policy" className="text-[12.5px] text-white/65 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="text-[12.5px] text-white/65 hover:text-white transition-colors">
              Cookies
            </Link>
            <Link href="/children-privacy-policy" className="text-[12.5px] text-white/65 hover:text-white transition-colors">
              Children&apos;s Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
