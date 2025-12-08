import { Mail, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";

// Force static rendering - contact page form is client-side, no server dependencies
export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground container mx-auto">
              Have questions or feedback? We&apos;d love to hear from you. Send
              us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Email</h3>
                    </div>
                    <a
                      href="mailto:support@travelbuddy.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      support@travelbuddy.com
                    </a>
                  </div>

                  {/* Response Time */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Response Time</h3>
                    </div>
                    <p className="text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </div>

                  {/* Office Hours */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Office Hours</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Monday - Friday
                      <br />
                      9 AM - 6 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

