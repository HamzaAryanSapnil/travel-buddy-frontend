import PublicFooter from "@/components/navigation/PublicFooter";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { Fraunces } from "next/font/google";
import { Suspense } from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-fraunces",
});

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${fraunces.variable} [&_h1]:[font-family:var(--font-fraunces),ui-serif,serif] [&_h1]:font-[600] [&_h1]:tracking-[-0.02em] [&_h1]:text-balance [&_h2]:[font-family:var(--font-fraunces),ui-serif,serif] [&_h2]:font-[600] [&_h2]:tracking-[-0.02em] [&_h2]:text-balance [&_p]:text-pretty selection:bg-primary/20 [&_button]:active:scale-[0.96] [&_button]:motion-safe:transition-transform [&_button]:motion-safe:duration-150`}
    >
      <Suspense fallback={null}>
        <PublicNavbar />
      </Suspense>
      {children}
      <PublicFooter />
    </div>
  );
}