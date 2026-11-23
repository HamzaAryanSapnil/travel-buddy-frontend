import type { Metadata } from "next";
import { developerInfo } from "@/config/developer.config";
import ContactInfoCards from "@/components/modules/Contact/ContactInfoCards";
import ContactForm from "@/components/forms/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Have questions or feedback? I'd love to hear from you.",
};

// Force static rendering - contact page form is client-side, no server dependencies
export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? I&apos;d love to hear from you. Send
            me a message and I&apos;ll respond as soon as possible.
          </p>
        </div>

        <ul className="mx-auto mb-12 max-w-2xl space-y-3 text-left text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Trip planning.</span>{" "}
            Questions about building an itinerary or picking a destination.
          </li>
          <li>
            <span className="font-medium text-foreground">Group collaboration.</span>{" "}
            Planning a trip with other people or sharing one plan.
          </li>
          <li>
            <span className="font-medium text-foreground">Feedback.</span>{" "}
            Tell us what is working and what should change.
          </li>
        </ul>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Me a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <ContactInfoCards developerInfo={developerInfo} />
          </div>
        </div>
      </div>
    </main>
  );
}