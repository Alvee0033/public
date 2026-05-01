"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Mail, 
  Calendar,
  Star,
  Gift,
  Users,
  BookOpen,
  Shield,
  Sparkles
} from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get subscription details from URL params
  const subscriptionId = searchParams.get('subscription_id');
  const planType = searchParams.get('plan_type') || 'passport';
  const amount = searchParams.get('amount') || '120';
  const interval = searchParams.get('interval') || 'year';
  
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    // Simulate loading and fetching subscription data
    const timer = setTimeout(() => {
      setSubscriptionData({
        id: subscriptionId || 'sub_example123',
        plan_name: 'ScholarPASS Passport',
        amount: amount,
        interval: interval,
        status: 'active',
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        features: [
          'Personalized Learning Pathway',
          'Scholarship Matching Engine',
          'Verified Student Portfolio',
          'AI-Powered Assessment',
          '2 Mentors + 5 AI Agents'
        ]
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [subscriptionId, amount, interval]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-300 via-sky-400 to-indigo-400 blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-300 via-purple-400 to-indigo-400 blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6 animate-bounce">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Welcome to ScholarPASS Passport
          </p>
          
          <p className="text-gray-500">
            Your subscription has been activated and you're ready to start your scholarship journey!
          </p>
        </div>

        {/* Subscription Details Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Subscription Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-emerald-600" />
                Subscription Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">{subscriptionData?.plan_name}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-emerald-600">${subscriptionData?.amount}/{subscriptionData?.interval}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Next Billing</span>
                  <span className="font-semibold text-gray-900">{subscriptionData?.current_period_end}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subscription ID</span>
                  <span className="font-mono text-sm text-gray-500">{subscriptionData?.id}</span>
                </div>
              </div>
            </div>

            {/* Right: What's Included */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-emerald-600" />
                What's Included
              </h4>
              
              <div className="space-y-3">
                {subscriptionData?.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-lg border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Your verified portfolio is being created!
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  You'll receive an email with setup instructions within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Dashboard */}
          <Link href="/lms/student-dashboard" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4 group-hover:bg-emerald-200 transition-colors">
                  <ArrowRight className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Go to Dashboard</h3>
                <p className="text-gray-600 text-sm">Start exploring your personalized learning pathway</p>
              </div>
            </div>
          </Link>

          {/* Download Receipt */}
          <button className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Receipt</h3>
                <p className="text-gray-600 text-sm">Get your payment receipt for records</p>
              </div>
            </div>
          </button>

          {/* Contact Support */}
          <Link href="/support" className="group">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Support</h3>
                <p className="text-gray-600 text-sm">Need help? Our team is here for you</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-600" />
            What Happens Next?
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">1</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email Confirmation</h4>
                  <p className="text-gray-600 text-sm">Check your inbox for a welcome email with next steps and login credentials.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">2</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Profile Setup</h4>
                  <p className="text-gray-600 text-sm">Complete your student profile to unlock personalized scholarship matches.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">3</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Meet Your Mentors</h4>
                  <p className="text-gray-600 text-sm">Schedule your first session with our expert mentors within 48 hours.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-xl p-6 border border-emerald-100">
              <div className="text-center">
                <Mail className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Important</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Save this confirmation page and check your email for setup instructions.
                </p>
                <button className="text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors">
                  Resend Welcome Email →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/lms/student-dashboard"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-sky-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <BookOpen className="h-5 w-5" />
            Start Your Journey
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <p className="text-gray-500 text-sm mt-4">
            Questions? Email us at <a href="mailto:support@scholarpass.ai" className="text-emerald-600 hover:underline">support@scholarpass.ai</a>
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-sm">
          <Shield className="h-4 w-4" />
          <span>Secured by Stripe • Your payment information is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}