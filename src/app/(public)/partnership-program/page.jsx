import Link from "next/link";
import { Building2, CheckCircle, Globe, MapPin, Star, Users } from "lucide-react";

const BENEFITS = [
  { icon: Globe, title: "Global Visibility", desc: "Your hub appears on the ScholarPASS directory, accessible to students and guardians worldwide." },
  { icon: Star, title: "Hub Class Score", desc: "Earn a verified score (0–150) that reflects your quality, boosting your ranking in search results." },
  { icon: Users, title: "Student Discovery", desc: "Connect with thousands of students actively searching for learning hubs in your area." },
  { icon: MapPin, title: "Map Listing", desc: "Show up on our interactive map with a verified location pin." },
  { icon: CheckCircle, title: "KYC Verification", desc: "Get a verified badge that signals trust and legitimacy to prospective students." },
  { icon: Building2, title: "Partner Dashboard", desc: "Manage your hub profile, upload documents, and track approval status in one place." },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Create a Partner Account", desc: "Register on ScholarPASS and select the \u201cLearning Hub Partner\u201d role." },
  { step: 2, title: "Register Your Hub", desc: "Complete the 3-step hub registration wizard with your profile, location, and documents." },
  { step: 3, title: "Admin Review (72 hrs)", desc: "Our team reviews your application within 72 hours and either approves or gives feedback." },
  { step: 4, title: "Go Live", desc: "Once approved, your hub is live in the directory with a class score that improves over time." },
];

export default function PartnershipProgramPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 py-24 px-4 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            HubOS — Learning Hub Directory
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Bring Your Learning Hub<br />to the World
          </h1>
          <p className="text-lg text-green-100 mb-10 max-w-xl mx-auto">
            Join the ScholarPASS Hub Directory and connect with students, guardians, and tutors in your region — and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learninghubs/register"
              className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors"
            >
              Register Your Hub
            </Link>
            <Link
              href="/register"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Create Partner Account
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why List With ScholarPASS?</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Everything you need to be discovered, trusted, and chosen by students.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Get live in 4 simple steps.</p>
          </div>
          <div className="space-y-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 mb-8">It only takes a few minutes to register. Our team will review within 72 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors"
            >
              Create Partner Account →
            </Link>
            <Link
              href="/hub-directory-page"
              className="inline-block border-2 border-white/60 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse Hub Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
