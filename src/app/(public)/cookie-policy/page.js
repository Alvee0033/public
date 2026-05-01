import Link from "next/link";

const CookiePolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">ScholarPASS Cookie Policy</h1>

      <div className="mb-6">
        <p>
          At ScholarPASS, we are committed to transparency and your privacy. This Cookie Policy explains how and why cookies and similar tracking technologies are used when you visit our websites and apps.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Our Services Using Cookies:</h2>
        <ul className="list-disc pl-5 mb-4">
          {['ScholarPASS', 'LearningART', 'Tutoring Platform', 'LearningHub', 'ScholarPASS Store', 'Microsoft Teams Classroom'].map((service, idx) => (
            <li key={idx} className="mb-1">{service}</li>
          ))}
        </ul>
        <p className="text-sm">
          This policy is part of our broader <Link href="terms-of-use" className="text-blue-600">Terms of Service</Link> and <Link href="children-privacy-policy" className="text-blue-600">Privacy Policy</Link>.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. What Are Cookies?</h2>
          <p className="mb-4">
            Cookies are small text files placed on your device when you access a website or use an application. They allow us to remember your preferences, improve functionality, and tailor your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Why We Use Cookies</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border">Category</th>
                  <th className="text-left p-2 border">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { category: 'Strictly Necessary', purpose: 'Essential for core functionality like login sessions, security, and network management.' },
                  { category: 'Performance & Analytics', purpose: 'Track usage patterns with tools like Google Analytics, Microsoft Clarity, and Meta Pixel.' },
                  { category: 'Functional', purpose: 'Remember user choices like language/region and provide personalized features.' },
                  { category: 'Marketing & Targeting', purpose: 'Deliver relevant ads via Facebook Ads, Google Ads, LinkedIn, and Snapchat.' },
                  { category: 'Third-Party Collaboration', purpose: 'Includes services like Zoom, Microsoft Teams, Stripe for communication and payments.' },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border font-medium">{row.category}</td>
                    <td className="p-2 border">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Microsoft Teams Integration</h2>
          <p className="mb-4">
            ScholarPASS integrates with Microsoft Teams to deliver live virtual classrooms, particularly for group sessions and partner-led tutoring programs. Cookies and APIs from Microsoft may be activated to ensure functionality, authentication, and session continuity.
          </p>
          <Link href="https://privacy.microsoft.com" className="text-blue-600">
            Microsoft&apos;s Privacy Statement
          </Link>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Managing Cookie Preferences</h2>
          <p className="mb-4">
            We respect your control over your data. When you first visit our website, a banner allows you to accept all cookies or customize your preferences.
          </p>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Browser Cookie Controls:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link href="https://support.google.com/chrome/answer/95647" className="text-blue-600">Chrome Settings</Link>
              <Link href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-blue-600">Firefox Preferences</Link>
              <Link href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600">Safari Settings</Link>
              <Link href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600">Edge Settings</Link>
            </div>
          </div>
          
          <p className="text-sm">
            Note: Disabling certain cookies may impact functionality of our Services, including personalization and live support features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Cookie Retention</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Session Cookies</h3>
              <p>Deleted when you close your browser.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Persistent Cookies</h3>
              <p>Remain on your device until manually removed or they expire (up to 3 years depending on purpose).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Have questions about our Cookie Policy?</h3>
              <ul className="space-y-2">
                <li>
                  Email: <Link href="mailto:connect@tutorsplan.com" className="text-blue-600">connect@tutorsplan.com</Link>
                </li>
                <li>
                  Website: <Link href="https://www.tutorsplan.com" className="text-blue-600">www.tutorsplan.com</Link>
                </li>
                <li>
                  Location: New York City, USA
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Learn More About Cookies</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://www.allaboutcookies.org" className="text-blue-600">All About Cookies</Link>
                </li>
                <li>
                  <Link href="https://www.networkadvertising.org" className="text-blue-600">Network Advertising Initiative</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center text-sm border-t pt-6">
        <p>By continuing to use our Services, you acknowledge our use of cookies as described in this policy.</p>
        <p className="mt-2">Last updated: April 1, 2025</p>
      </div>
    </div>
  );
};

export default CookiePolicy;