import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">ScholarPASS Terms and Conditions</h1>

      <div className="mb-6">
        <p>
          Welcome to ScholarPASS. These Terms govern your access to and use of our websites, mobile apps, and services including LearningART, ScholarPASS, Tutoring Services, ScholarPASS Store, and LearningHub.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. About ScholarPASS</h2>
          <p className="mb-4">
            ScholarPASS is an education technology company committed to empowering students through personalized learning, scholarship access, and educational marketplace services. Our platform serves students, parents, tutors, institutions, and educational partners globally.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
          <p className="mb-2">
            To use our services:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>You must be 13 years or older; or</li>
            <li>If under 13, your parent or legal guardian must provide verifiable consent (see <Link href="children-privacy-policy" className="text-blue-600">Child Privacy Policy</Link>)</li>
          </ul>
          <p>
            Tutors, institutions, and vendors must meet additional eligibility criteria and comply with onboarding requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Account Registration and Responsibilities</h2>
          <p className="mb-2">
            When registering for a ScholarPASS account, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Provide accurate, up-to-date information</li>
            <li>Maintain the confidentiality of your login credentials</li>
            <li>Accept responsibility for all activity under your account</li>
          </ul>
          <p>
            You agree to immediately notify us of any unauthorized access or suspicious activity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Services Overview</h2>
          <p className="mb-4">
            ScholarPASS provides a comprehensive suite of educational services:
          </p>
          
          <div className="space-y-4">
            {[
              {
                name: "LearningART",
                description: "Our AI-driven learning platform offers personalized self-paced and live courses, smart assessments, gamified challenges, and real-time performance tracking to optimize student learning."
              },
              {
                name: "ScholarPASS",
                description: "A global scholarship and student support system offering full or partial funding for educational services, including tutoring, courses, and extracurricular programs, backed by donations, CSR funds, and grants."
              },
              {
                name: "Tutoring Services",
                description: "Personalized one-on-one and group tutoring sessions across all K–12 subjects, test prep, and enrichment programs—delivered online or in-person by certified tutors."
              },
              {
                name: "ScholarPASS Store",
                description: "An education-focused e-commerce platform offering school supplies, robotics and coding kits, STEM accessories, learning tools, and partner merchandise."
              },
              {
                name: "LearningHub",
                description: "A local and global education marketplace that connects students with vetted K–12 schools, tutoring centers, sports academies, and specialty institutes worldwide."
              }
            ].map((service, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold mb-1">{service.name}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Payments and Billing</h2>
          <p className="mb-4">
            ScholarPASS services are offered via subscription, one-time fees, or scholarships.
          </p>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border">Service</th>
                  <th className="text-left p-2 border">Pricing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: "LearningART", pricing: "$25/month or $300/year, plus a $50 registration fee" },
                  { service: "ScholarPASS", pricing: "$100/month or $1,200/year (up to 100% covered for eligible students)" },
                  { service: "Tutoring Services", pricing: "$350/year for U.S. students, partially subsidized by ScholarPASS" }
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border font-medium">{row.service}</td>
                    <td className="p-2 border">{row.pricing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p>
            All payments are processed through secure third-party gateways. Unless otherwise stated, all fees are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Use of Content and Intellectual Property</h2>
          <p className="mb-4">
            All content provided by ScholarPASS—including AI features, curriculum, video sessions, platform software, branding, and documentation—is protected by intellectual property laws.
          </p>
          <p className="font-medium mb-4">
            You may not copy, reproduce, distribute, or modify our content without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. User-Generated Content</h2>
          <p className="mb-2">
            If you upload or share any content (e.g., student responses, tutor materials, reviews), you:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Retain ownership of your content</li>
            <li>Grant ScholarPASS a royalty-free, global license to use it for educational and promotional purposes</li>
            <li>Agree not to post anything unlawful, harmful, defamatory, or inappropriate</li>
          </ul>
          <p>
            ScholarPASS reserves the right to remove or restrict content at its discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Third-Party Services and Tools</h2>
          <p className="mb-2">
            ScholarPASS may use or integrate with third-party tools and platforms such as:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Zoom', 'Google Meet', 'BigBlueButton', 'Stripe', 'PayPal', 'Microsoft Teams'].map((service, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">{service}</span>
            ))}
          </div>
          <p>
            We are not responsible for the terms, functionality, or privacy practices of third-party providers. Use them at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Mobile App and Platform Access</h2>
          <p className="mb-2">
            ScholarPASS services may be accessed through mobile apps, web portals, or integrated tools. You are responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Maintaining a compatible device and internet connection</li>
            <li>Ensuring compliance with third-party app store policies</li>
            <li>Updating software as required for optimal performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Privacy and Security</h2>
          <p className="mb-2">
            We prioritize your data privacy. Information is collected, used, and stored in accordance with:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li><Link href="privacy-policy" className="text-blue-600">Our Privacy Policy</Link></li>
            <li><Link href="children-privacy-policy" className="text-blue-600">Child Privacy Policy</Link></li>
          </ul>
          <p>
            We use industry-standard encryption and secure access protocols to protect your data.
          </p>
        </section>

        {[
          {
            title: "11. Termination and Suspension",
            content: "ScholarPASS may suspend or terminate your account for breach of these Terms, misuse of the platform, or non-payment. You may also terminate your account at any time by contacting connect@tutorsplan.com."
          },
          {
            title: "12. Limitation of Liability",
            content: "To the extent permitted by law, ScholarPASS is not liable for indirect damages, loss of data or business opportunities, or unauthorized account access. Total liability will not exceed the amount paid for the service in question within the last 12 months."
          },
          {
            title: "13. Indemnification",
            content: "You agree to indemnify ScholarPASS from any claims arising from your use of the services, violation of these Terms, or infringement of intellectual property rights."
          },
          {
            title: "14. Disclaimers",
            content: "ScholarPASS services are provided 'as is.' While we strive for accuracy and reliability, we make no guarantees regarding learning outcomes, continuous service access, or compatibility with all devices."
          },
          {
            title: "15. Changes to Terms",
            content: "We may update these Terms from time to time. Updates will be posted on our website and take effect upon publication. Continued use constitutes acceptance of revised Terms."
          },
          {
            title: "16. Governing Law and Jurisdiction",
            content: "These Terms are governed by the laws of the State of New York, USA. Disputes will be resolved in New York courts or through arbitration where required by law."
          },
          {
            title: "17. Contact Us",
            content: (
              <div>
                <p className="mb-2">If you have questions regarding these Terms, please contact:</p>
                <ul className="space-y-1">
                  <li>Email: <Link href="mailto:connect@tutorsplan.com" className="text-blue-600">connect@tutorsplan.com</Link></li>
                  <li>Address: 123 Education Way, New York, NY 10001, USA</li>
                </ul>
              </div>
            )
          }
        ].map((section, index) => (
          <section key={index}>
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <div>
              {typeof section.content === 'string' ? <p>{section.content}</p> : section.content}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 border-t pt-6 text-center text-sm">
        <p>By using our Services, you agree to these Terms and Conditions.</p>
        <p className="mt-2">© 2025 ScholarPASS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;