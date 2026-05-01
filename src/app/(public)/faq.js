'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const faqItems = [
  {
    question: 'What is Tutor Plans?',
    answer:
      'Tutor Plans is an online platform that connects students with mentors who offer a wide range of skill-enhancing courses. It allows students to learn from their favorite mentors and for mentors to upload and share their expertise through comprehensive courses.',
  },
  {
    question: 'How do I sign up for Tutor Plans?',
    answer:
      "Signing up for Tutor Plans is easy. Simply click on the 'Sign Up' button on the homepage, fill in your details, and follow the instructions to create your account. You can then browse courses and enroll in the ones that interest you.",
  },
  {
    question: 'What types of courses are available on Tutor Plans?',
    answer:
      "Tutor Plans offers a diverse selection of courses across various subjects and skill levels. Whether you're looking to learn a new language, develop technical skills, enhance your career, or explore a hobby, there's something for everyone.",
  },
  {
    question: 'How can I enroll in a course?',
    answer:
      "To enroll in a course, log in to your Tutor Plans account, browse the course catalog, and click on the course you wish to join. Follow the enrollment instructions, and you'll be able to access the course materials and start learning immediately.",
  },
  {
    question: 'Do I receive a certificate after completing a course?',
    answer:
      'Yes, upon successfully completing a course, you will receive a certificate of completion. This certificate can be downloaded and shared to showcase your newly acquired skills and knowledge.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the FAQ items based on search term
  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset activeIndex when search term changes
  useEffect(() => {
    setActiveIndex(null);
  }, [searchTerm]);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white mt-10">
      <div className="container-lg mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 animate-fade-in-down">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 pr-4 rounded-full border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
          {filteredFAQs.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isActive={activeIndex === index}
              onToggle={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            />
          ))}
          {filteredFAQs.length === 0 && (
            <p className="text-center text-gray-500 mt-8 animate-fade-in">
              No matching FAQs found. Please try a different search term.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, isActive, onToggle }) {
  const [height, setHeight] = useState(undefined);

  useEffect(() => {
    if (isActive) {
      const element = document.getElementById(`faq-answer-${question}`);
      if (element) {
        setHeight(element.scrollHeight);
      }
    } else {
      setHeight(0);
    }
  }, [isActive, question]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-100 transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
      <button
        className="flex justify-between items-center w-full p-5 text-left focus:outline-none bg-gradient-to-r from-blue-50 to-white"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <span className="font-semibold text-lg text-blue-700">{question}</span>
        <ChevronDown
          className={`w-6 h-6 text-blue-500 transition-transform duration-300 ${
            isActive ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: height === undefined ? 'auto' : `${height}px` }}
      >
        <div id={`faq-answer-${question}`} className="p-5 bg-white">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
