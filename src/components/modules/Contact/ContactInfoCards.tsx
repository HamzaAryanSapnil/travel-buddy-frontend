import { developerInfo } from "@/config/developer.config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, Phone, ExternalLink, Globe } from "lucide-react";
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

interface ContactInfoCardsProps {
  developerInfo: DeveloperInfo;
}

export default function ContactInfoCards({ developerInfo }: ContactInfoCardsProps) {
  return (
    <div className="space-y-6">
      {/* Developer Profile Card */}
      <Card className="animate-in fade-in slide-in-from-bottom duration-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-20 h-20 animate-in fade-in zoom-in duration-700">
              <AvatarImage src={developerInfo.profileImage} alt={developerInfo.name} />
              <AvatarFallback className="text-xl">
                {developerInfo.avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">{developerInfo.name}</CardTitle>
          <CardDescription>{developerInfo.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Email</h3>
            </div>
            <a
              href={`mailto:${developerInfo.email}`}
              className="text-muted-foreground hover:text-blue-600 transition-colors text-sm"
            >
              {developerInfo.email}
            </a>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Phone</h3>
            </div>
            <a
              href={`tel:${developerInfo.phone.replace(/\s/g, "")}`}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {developerInfo.phone}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Social Links Card */}
      <Card className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-lg">Connect With Me</CardTitle>
          <CardDescription>Follow me on social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start hover:text-[#25D366] hover:border-[#25D366] transition-colors" size="sm">
            <Link
              href={developerInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-4 h-4 mr-2" />
              WhatsApp
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start hover:text-[#0077B5] hover:border-[#0077B5] transition-colors" size="sm">
            <Link
              href={developerInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start hover:text-[#181717] hover:border-[#181717] transition-colors" size="sm">
            <Link
              href={developerInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-4 h-4 mr-2" />
              GitHub
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start" size="sm">
            <Link
              href={developerInfo.portfolio}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="w-4 h-4 mr-2" />
              Portfolio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


