import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with ScholarPASS?",
    answer:
      "Simply create an account, browse our course catalog, and enroll in courses that interest you. You can start learning immediately after enrollment.",
  },
  {
    question: "Are the courses self-paced or scheduled?",
    answer:
      "Most of our courses are self-paced, allowing you to learn at your own speed. Some premium courses may include live sessions with instructors.",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer:
      "Yes! You'll receive a verified certificate of completion for each course you finish, which you can add to your LinkedIn profile or resume.",
  },
  {
    question: "What's included in the subscription plans?",
    answer:
      "Subscription plans include unlimited access to our course library, exclusive content, priority support, and monthly live Q&A sessions with experts.",
  },
  {
    question: "Can I access courses on mobile devices?",
    answer:
      "Our platform is fully responsive and we also have mobile apps for iOS and Android for learning on the go.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <span className="text-3xl not-italic">❓</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to the most common questions about ScholarPASS
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl px-6 border-0 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-800 hover:text-blue-600 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
