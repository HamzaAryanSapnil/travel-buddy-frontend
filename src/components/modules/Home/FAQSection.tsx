"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does Travel Buddy help me plan my trips?",
    answer:
      "Travel Buddy uses AI-powered technology to generate personalized travel itineraries based on your preferences, budget, and destination. You can also collaborate with friends to plan trips together, manage expenses, and organize all your travel details in one place.",
  },
  {
    question: "Can I collaborate with friends on travel plans?",
    answer:
      "Yes! Travel Buddy is designed for collaboration. You can invite friends to your travel plans, share ideas, manage itineraries together, track expenses, and coordinate meetups. The platform makes group trip planning seamless and enjoyable.",
  },
  {
    question: "How does the expense tracking work?",
    answer:
      "Travel Buddy's expense tracking feature allows you to add expenses, categorize them, and automatically split costs among travel companions. You can see who paid what, view expense summaries with charts, and ensure transparent financial management for your trips.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Travel Buddy is a responsive web application that works perfectly on all devices including mobile phones and tablets. You can access all features through your mobile browser without needing to download a separate app.",
  },
  {
    question: "How do I join a public travel plan?",
    answer:
      "You can browse public travel plans on the platform and send a join request to the plan owner. Once approved, you'll become a member and can participate in planning activities, view itineraries, and collaborate with other members.",
  },
  {
    question: "What subscription plans are available?",
    answer:
      "Travel Buddy offers flexible monthly and yearly subscription plans. You can choose the plan that best fits your needs and manage your subscription, payment history, and cancel or resume subscriptions anytime through your dashboard.",
  },
  {
    question: "Can I use Travel Buddy for free?",
    answer:
      "Travel Buddy offers various features that may require a subscription for full access. You can explore the platform and see which features are available to you. Check our pricing page for detailed information about subscription plans.",
  },
  {
    question: "How secure is my travel data?",
    answer:
      "We take security seriously. Travel Buddy uses JWT-based authentication, encrypted data transmission, and secure cookie handling. Your travel plans can be set to private, and you have full control over who can view and edit your plans.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about Travel Buddy
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-4 bg-background animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

