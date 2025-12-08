import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function PublicFooter() {
  return (
    <footer className="border-t bg-background w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-2">Company</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plan your perfect trip with friends and family. Create memories
              that last a lifetime.
            </p>
          </div>

          {/* Features Column */}
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/plans"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  AI Planner
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Collaboration
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Expenses
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground text-wrap">
                123 Travel Street
                <br />
                Adventure City, AC 12345
                <br />
                contact@travelbuddy.com
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground text-wrap">
          © {new Date().getFullYear()} Travel Buddy. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
