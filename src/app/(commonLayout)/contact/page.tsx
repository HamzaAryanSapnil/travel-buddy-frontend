import { developerInfo } from "@/config/developer.config";
import ContactInfoCards from "@/components/modules/Contact/ContactInfoCards";
import ContactForm from "@/components/modules/Contact/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Force static rendering - contact page form is client-side, no server dependencies
export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24 animate-in fade-in zoom-in duration-700">
              <AvatarImage src={developerInfo.profileImage} alt={developerInfo.name} />
              <AvatarFallback className="text-3xl">
                {developerInfo.avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? I&apos;d love to hear from you. Send
            me a message and I&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-left duration-700">
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
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <ContactInfoCards developerInfo={developerInfo} />
          </div>
        </div>
      </div>
    </main>
  );
}
