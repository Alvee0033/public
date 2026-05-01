import ContactFormSection from "@/components/sections/contact-form/ContactFormSection";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ContactMain = () => {
  return (
    <>
      <HeroPrimary path={"Contact Page"} title={"Contact Page"} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    {/* Email */}
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Mail className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Email Support
                            </h3>
                            <p className="text-gray-600 mb-2">
                              Get help with your account
                            </p>
                            <a
                              href="mailto:support@tutorsplan.com"
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              support@tutorsplan.com
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Phone */}
                    <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Phone className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Phone Support
                            </h3>
                            <p className="text-gray-600 mb-2">
                              Speak with our team
                            </p>
                            <a
                              href="tel:+12123473332"
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              +1 (212) 347-3332
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Address */}
                    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <MapPin className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Office Address
                            </h3>
                            <p className="text-gray-600 mb-2">
                              Visit us in person
                            </p>
                            <address className="text-purple-600 not-italic">
                              285 Fulton St.
                              <br />
                              New York, NY 10007
                            </address>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactFormSection />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactMain;
