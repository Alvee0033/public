import React from 'react';
import Link from "next/link";

const ChildPrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ScholarPASS Child Privacy Policy</h1>

      <div className="mb-6">
        <p>
          ScholarPASS Corporation is committed to protecting the privacy of all students who use our platforms and services, especially children under the age of 13. This Child Privacy Policy explains how we collect, use, and protect personal information from children through our platforms, including ScholarPASS.org, LearningART.io, and our tutoring programs.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect From Children</h2>
          <p className="mb-2">
            We may collect the following types of personal information directly from children:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Name</li>
            <li>Grade level and school</li>
            <li>Parent or guardian contact information</li>
            <li>Email address (when necessary for learning tools)</li>
            <li>Assessment data, tutoring history, or course preferences</li>
            <li>Learning goals and progress reports</li>
            <li>Voice recordings or video (for online classes, with consent)</li>
          </ul>
          <p>
            We do not require a child to disclose more information than is reasonably necessary to participate in our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use This Information</h2>
          <p className="mb-2">
            We use children&apos;s information solely to provide personalized educational services, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Creating student profiles</li>
            <li>Matching with tutors or recommended courses</li>
            <li>Delivering assessments, lessons, and feedback</li>
            <li>Tracking progress and learning outcomes</li>
            <li>Granting scholarships through ScholarPASS</li>
            <li>Communicating with parents or guardians about progress</li>
          </ul>
          <p>
            We do not use children&apos;s information for targeted advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Parental Consent</h2>
          <p className="mb-2">
            We require verifiable parental or guardian consent before collecting personal information from a child under 13. This may include:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Electronic consent via parent account</li>
            <li>Consent form via email</li>
            <li>Consent obtained through school or educational partner acting under FERPA</li>
          </ul>
          <p>
            Parents may withdraw consent at any time, and we will delete the child&apos;s information upon request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Sharing Information</h2>
          <p className="mb-2">
            ScholarPASS does not sell or rent children&apos;s personal information. We may share it only with:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Tutors or academic coordinators providing services</li>
            <li>Partner institutions (e.g., schools) with proper consent</li>
            <li>Service providers assisting us under strict data protection agreements</li>
            <li>As required by law, such as in response to a legal request</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
          <p>
            We use industry-standard encryption and secure storage to protect all personal data. Access is limited to authorized personnel only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Parent Rights</h2>
          <p className="mb-2">
            Parents and guardians have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Review the personal information we have collected from their child</li>
            <li>Request corrections or deletions</li>
            <li>Revoke consent for further collection or use</li>
          </ul>
          <p>
            To exercise these rights, email us at <Link href="mailto:privacy@tutorsplan.org" className="text-blue-600">privacy@tutorsplan.org</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
          <p className="mb-2">
            If you have questions about our Child Privacy Policy, please contact:
          </p>
          <ul className="space-y-1">
            <li>ScholarPASS Corporation</li>
            <li>Email: <Link href="mailto:privacy@tutorsplan.org" className="text-blue-600">privacy@tutorsplan.org</Link></li>
            <li>Phone: 212-347-7770</li>
            <li>Mailing Address: 335 West 12 Street, Deer Park, NY 10118, USA</li>
          </ul>
        </section>
      </div>

      <div className="mt-8 border-t pt-6 text-center text-sm">
        <p>By using our Services, you agree to this Child Privacy Policy.</p>
        <p className="mt-2">© 2025 ScholarPASS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ChildPrivacyPolicy;