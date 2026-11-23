import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Plan the next trip with us
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-primary-foreground/80">
          Open an account to plan together, or send a message from the contact
          page.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href={ROUTES.REGISTER}>Create an account</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link href={ROUTES.CONTACT}>Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}