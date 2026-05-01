"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BiLogoTiktok } from "react-icons/bi";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const FOOTER_CATEGORIES_CACHE_KEY = "sp_footer_categories_v1";
const FOOTER_CATEGORIES_CACHE_TTL_MS = 10 * 60 * 1000;

const Footer = () => {
  const socialLinks = [
    { href: "https://facebook.com", Icon: Facebook, label: "Facebook" },
    { href: "https://x.com", Icon: Twitter, label: "X" },
    { href: "https://tiktok.com", Icon: BiLogoTiktok, label: "Tiktok" },
    { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
    { href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
    { href: "https://youtube.com", Icon: Youtube, label: "Youtube" },
  ];

  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(FOOTER_CATEGORIES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (
          parsed?.expiresAt &&
          parsed.expiresAt > Date.now() &&
          Array.isArray(parsed.items)
        ) {
          setCourseCategories(parsed.items);
          return;
        }
      }
    } catch {}

    async function fetchCategories() {
      try {
        // EOS26Core: legacy /course-categories does not exist — use shop catalog categories.
        const res = await axios.get("/shop-product-categories/published", {
          skipErrorLog: true,
        });
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        const nextItems = list.slice(0, 8);
        setCourseCategories(nextItems);
        try {
          sessionStorage.setItem(
            FOOTER_CATEGORIES_CACHE_KEY,
            JSON.stringify({
              items: nextItems,
              expiresAt: Date.now() + FOOTER_CATEGORIES_CACHE_TTL_MS,
            }),
          );
        } catch {}
      } catch {
        setCourseCategories([]);
      }
    }

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(fetchCategories, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(fetchCategories, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block bg-white p-3 rounded-2xl">
              <Image src="/icons/scholarpass-logo.png" alt="ScholarPASS" width={140} height={40} className="h-8 w-auto" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xs">
              AI-Powered education ecosystem connecting students to global opportunities, elite tutoring, and career-defining bootcamps.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all group"
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Platform
            </h3>
            <ul className="space-y-4">
              {[
                { label: "ScholarPASS Plus", href: "/scholarpass-plus" },
                { label: "K-12 Tutoring", href: "/k12-tutoring" },
                { label: "Career Bootcamps", href: "/career-bootcamps" },
                { label: "Institute Directory", href: "/institutes" },
                { label: "LearningHub", href: "/learninghub" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium hover:text-blue-500 flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8">Popular Categories</h3>
            <ul className="grid grid-cols-1 gap-4">
              {courseCategories.map((cat) => {
                const pu = cat.public_url?.trim();
                const href =
                  pu?.startsWith("http")
                    ? pu
                    : pu?.startsWith("/")
                      ? pu
                      : `/product-list?category=${encodeURIComponent(cat.name || "")}`;
                const external = pu?.startsWith("http");
                return (
                  <li key={cat.id}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-blue-500 text-left transition-colors inline-block"
                      >
                        {cat.name}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm font-medium hover:text-blue-500 text-left transition-colors inline-block"
                      >
                        {cat.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-sm leading-relaxed">
                  <span className="block text-white font-bold mb-1">Office</span>
                  285 Fulton St, New York, NY 10007
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-sm">
                  <span className="block text-white font-bold mb-1">Email</span>
                  support@scholarpass.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © 2026 ScholarPASS. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="text-xs font-bold hover:text-white transition-colors">TERMS</Link>
            <Link href="/privacy" className="text-xs font-bold hover:text-white transition-colors">PRIVACY</Link>
            <Link href="/cookies" className="text-xs font-bold hover:text-white transition-colors">COOKIES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
