import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";

interface DeveloperInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  portfolio: string;
  profileImage: string;
  avatarFallback: string;
}

interface DeveloperSectionProps {
  developerInfo: DeveloperInfo;
}

export default function DeveloperSection({
  developerInfo,
}: DeveloperSectionProps) {
  return (
    <section className="border-t pt-16 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Developer</h2>
        <p className="text-muted-foreground">
          Get in touch with the developer behind this project
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={developerInfo.profileImage}
                  alt={developerInfo.name}
                />
                <AvatarFallback className="text-2xl">
                  {developerInfo.avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{developerInfo.name}</CardTitle>
            <CardDescription className="text-base">
              {developerInfo.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${developerInfo.email}`}
                    className="text-foreground hover:text-blue-600 transition-colors"
                  >
                    {developerInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${developerInfo.phone.replace(/\s/g, "")}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {developerInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:text-[#25D366] hover:border-[#25D366] transition-colors"
              >
                <Link
                  href={developerInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="w-4 h-4 mr-2" />
                  WhatsApp
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:text-[#0077B5] hover:border-[#0077B5] transition-colors"
              >
                <Link
                  href={developerInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:text-[#181717] hover:border-[#181717] transition-colors"
              >
                <Link
                  href={developerInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-4 h-4 mr-2" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={developerInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Portfolio
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <Button asChild>
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
