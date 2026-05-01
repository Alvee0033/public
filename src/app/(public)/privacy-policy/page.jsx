"use client";

import Head from "next/head";
import { useEffect } from "react";

const sections = [
  { id: "what-we-collect", title: "1. What Data We Collect" },
  { id: "how-we-collect", title: "2. How We Collect Data" },
  { id: "data-usage", title: "3. What We Use Your Data For" },
  { id: "data-sharing", title: "4. Who We Share Your Data With" },
  { id: "security", title: "5. Security" },
  { id: "your-rights", title: "6. Your Rights" },
  { id: "jurisdiction", title: "7. Jurisdiction-Specific Rules" },
  { id: "updates", title: "8. Updates & Contact Info" },
];

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <>
      <Head>
        <title>Privacy Policy | ScholarPASS</title>
      </Head>
      <main className="max-w-6xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-4xl font-bold mb-6">ScholarPASS Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">
          Effective Date: July 17, 2025
        </p>

        {/* Table of Contents */}
        <nav className="mb-10 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
          <ul className="space-y-2 list-disc list-inside">
            {sections.map(({ id, title }) => (
              <li key={id}>
                <a href={`#${id}`} className="text-blue-600 hover:underline">
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section Content */}
        <div className="space-y-16">
          <section id="what-we-collect">
            <h2 className="text-2xl font-semibold mb-4">
              1. What Data We Collect
            </h2>
            <p>We collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Account data:</strong> name, email, phone, password,
                preferences
              </li>
              <li>
                <strong>Learning data:</strong> course progress, scores, session
                logs
              </li>
              <li>
                <strong>Payment data:</strong> billing info via Stripe (we don’t
                store card info)
              </li>
              <li>
                <strong>Device data:</strong> browser, IP address, location,
                usage
              </li>
            </ul>
          </section>

          <section id="how-we-collect">
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Collect Data
            </h2>
            <p>We use:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Forms, user inputs, uploaded documents</li>
              <li>Cookies, local storage, analytics tools</li>
              <li>Social login (Google/Facebook)</li>
              <li>Institutional access and APIs</li>
            </ul>
          </section>

          <section id="data-usage">
            <h2 className="text-2xl font-semibold mb-4">
              3. What We Use Your Data For
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and personalize tutoring</li>
              <li>Process payments & verify users</li>
              <li>Send updates and support communication</li>
              <li>Improve features and detect fraud</li>
            </ul>
          </section>

          <section id="data-sharing">
            <h2 className="text-2xl font-semibold mb-4">
              4. Who We Share Your Data With
            </h2>
            <p>We may share data with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Tutors and students (for session delivery)</li>
              <li>Stripe, AWS, analytics, and support tools</li>
              <li>Legal entities if required</li>
              <li>Buyers or partners in case of acquisition</li>
            </ul>
          </section>

          <section id="security">
            <h2 className="text-2xl font-semibold mb-4">5. Security</h2>
            <p>
              ScholarPASS uses encryption, firewalls, and secure cloud storage to
              protect data. Still, no system is fully immune—please safeguard
              your credentials.
            </p>
          </section>

          <section id="your-rights">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access and update your data anytime</li>
              <li>Request deletion or export</li>
              <li>Opt out of marketing emails</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">
              Email us at{" "}
              <a
                href="mailto:connect@tutorsplan.com"
                className="text-blue-600 underline"
              >
                connect@tutorsplan.com
              </a>
            </p>
          </section>

          <section id="jurisdiction">
            <h2 className="text-2xl font-semibold mb-4">
              7. Jurisdiction-Specific Rules
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>California (CCPA):</strong> Right to know, delete, opt
                out of data sharing
              </li>
              <li>
                <strong>EU/UK (GDPR):</strong> Access, rectify, object, lodge
                complaints with regulators
              </li>
              <li>
                <strong>Children:</strong> No use under 13; parents may request
                removal
              </li>
            </ul>
          </section>

          <section id="updates">
            <h2 className="text-2xl font-semibold mb-4">
              8. Updates & Contact Info
            </h2>
            <p>
              We may update this Privacy Policy. We will notify you of major
              changes via email or app alert.
            </p>
            <div className="mt-2">
              <p className="mb-2">For questions, contact:</p>
              <p className="mb-2">
                📧{' '}
                <a href="mailto:connect@tutorsplan.com" className="text-blue-600 underline">
                  connect@tutorsplan.com
                </a>
              </p>
              <div className="flex gap-2 items-start">
                <span>🏢</span>
                <address className="not-italic">
                  Brooklyn, New York 11201 <br /> United States
                </address>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
