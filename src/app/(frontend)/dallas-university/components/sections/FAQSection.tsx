'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Where can I find piano sales in Dallas?",
    answer: "Our KAWAI piano sales Dallas event at our dealership offers the best selection of digital and acoustic pianos in the Greater Dallas Area. We're Dallas's trusted piano dealer with over 5 years of partnership with UTD."
  },
  {
    question: "Do you have used pianos for sale in Dallas?",
    answer: "Yes! Our Dallas piano sale event features both new and carefully selected used pianos Dallas families love. All used pianos are inspected by UTD music faculty and come with warranties. Prices start at $949 for digital pianos."
  },
  {
    question: "What piano deals are available in Dallas during the event?",
    answer: "Piano deals Dallas residents can save up to $6,000 on premium KAWAI instruments. Our event features special pricing on digital pianos, upright pianos, and grand pianos, plus free delivery and tuning for VIP early access customers. Limited quantities available - only 25 consultation slots for guaranteed first selection."
  },
  {
    question: "Do you offer piano lessons in Dallas area?",
    answer: "While our primary focus is piano sales Dallas, we can connect you with qualified piano teachers in the Dallas area through our UTD Music Department partnership. Many of our piano customers also take advantage of piano lessons Dallas has to offer."
  },
  {
    question: "Where is your Dallas piano store located?",
    answer: "Our Dallas piano sale event takes place at our KAWAI Piano Gallery Dallas showroom at 601 W. Plano Parkway, Suite 153. As Dallas's premier piano dealer, our convenient location makes it easy for Greater Dallas Area families to shop for pianos."
  },
  {
    question: "What types of pianos are available at your Dallas location?",
    answer: "Our piano store Dallas event features KAWAI digital pianos, upright acoustic pianos, and grand pianos. From compact ES-120 models perfect for apartments to full-size GL-10 grand pianos, we have options for every Dallas piano family."
  },
  {
    question: "Do you provide financing for piano purchases in Dallas?",
    answer: "Yes! We offer financing options for our piano sales Dallas event. Monthly payments start as low as $79 for digital pianos. VIP consultation customers receive priority approval and exclusive financing terms. Limited-time special rates available only during this event."
  },
  {
    question: "What makes your Dallas piano sale different from other dealers?",
    answer: "Our partnership with University of Texas at Dallas's Music Department ensures every piano meets institutional quality standards. Unlike other piano dealers Dallas offers, our instruments are faculty-approved and your purchase directly supports UTD's music programs through our ongoing partnership."
  },
  {
    question: "How do I get priority booking for the Dallas event?",
    answer: "UTD students, faculty, and staff receive automatic priority booking privileges. With only 15 VIP consultation slots available for Day 1 early access, we recommend booking within 48 hours to guarantee your preferred time slot and first selection of our premium Dallas inventory."
  },
  {
    question: "How do I secure priority access to the best piano deals?",
    answer: "VIP consultation bookings receive guaranteed first selection privileges and early access to our premium inventory. With only 25 consultation slots available, booking early ensures you get priority access to the most sought-after instruments and exclusive early bird pricing."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our Dallas piano sales event and KAWAI piano deals
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have more questions about our Dallas piano sales?
          </p>
          <div className="space-y-2">
            <button className="bg-kawai-red text-white px-8 py-3 rounded-lg font-medium hover:bg-kawai-red/90 transition-colors">
              Contact Our Piano Experts - VIP Priority Line
            </button>
            <p className="text-sm text-orange-600 font-medium">
              Call within 24 hours for guaranteed consultation slot
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}